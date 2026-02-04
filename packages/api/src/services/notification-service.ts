import type {
  NotificationChannel,
  NotificationSourceType,
  NotificationStatus,
  Prisma,
  PrismaClient,
} from "@repo/db";

import { sendEmail } from "../notifications/email";
import { sendSms } from "../notifications/providers";
import { renderTemplateFromDb } from "../notifications/template";
import { sendWhatsapp } from "../notifications/whatsapp";

const DEFAULT_FREE_CHANNELS: NotificationChannel[] = ["EMAIL", "IN_APP"];
const METERED_CHANNELS: NotificationChannel[] = ["SMS", "WHATSAPP"];

interface Recipient {
  id: string;
  profile: "staff" | "contact" | "student";
  phone?: string | null;
  email?: string | null;
}

interface ChannelResolution {
  eligible: NotificationChannel[];
  ineligible: { channel: NotificationChannel; reason: string }[];
}
export class NotificationService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }
  async getStatuses(params: {
    sourceType: NotificationSourceType;
    sourceIds: string[];
    recipientId?: string;
    schoolId: string;
  }) {
    const rows = await this.db.notification.findMany({
      where: {
        sourceType: params.sourceType,
        schoolId: params.schoolId,
        sourceId: { in: params.sourceIds },
        ...(params.recipientId ? { recipientId: params.recipientId } : {}),
      },
      include: { deliveries: true },
    });
    const map = new Map<
      string,
      {
        notificationId: string;
        channel: Record<string, NotificationStatus>;
        overall: "NOT_SENT" | "PARTIAL" | "SENT" | "FAILED";
      }
    >();
    for (const n of rows) {
      const byChannel: Record<string, NotificationStatus> = {};
      let sentCount = 0;
      let failedCount = 0;

      for (const d of n.deliveries) {
        byChannel[d.channel] = d.status;
        if (d.status === "SENT") sentCount++;
        if (d.status === "FAILED") failedCount++;
      }

      const total = n.deliveries.length;
      const overall =
        total === 0
          ? "NOT_SENT"
          : sentCount === total
            ? "SENT"
            : sentCount > 0
              ? "PARTIAL"
              : failedCount > 0
                ? "FAILED"
                : "NOT_SENT";

      map.set(n.sourceId, {
        notificationId: n.id,
        channel: byChannel,
        overall,
      });
    }

    return Object.fromEntries(map.entries());
  }

  async resolveChannels(params: {
    recipientId: string;
    recipientProfile: "student" | "staff" | "contact";
    sourceType: NotificationSourceType;
  }) {
    const resolutions = await this.resolveChannelsForRecipients({
      recipients: [
        { id: params.recipientId, profile: params.recipientProfile },
      ],
      sourceType: params.sourceType,
    });
    const key = this.buildRecipientKey(
      params.recipientId,
      params.recipientProfile,
    );
    return resolutions.get(key) ?? { eligible: [], ineligible: [] };
  }

  async resolveChannelsForRecipients(params: {
    recipients: Pick<Recipient, "id" | "profile">[];
    sourceType: NotificationSourceType;
  }) {
    const uniqueRecipients = new Map<
      string,
      Pick<Recipient, "id" | "profile">
    >();
    for (const recipient of params.recipients) {
      uniqueRecipients.set(
        this.buildRecipientKey(recipient.id, recipient.profile),
        recipient,
      );
    }
    const recipientPairs = Array.from(uniqueRecipients.values());
    const recipientKeys = new Set(
      recipientPairs.map((r) => this.buildRecipientKey(r.id, r.profile)),
    );

    const preferences = await this.db.notificationPreference.findMany({
      where: {
        sourceType: params.sourceType,
        OR: recipientPairs.map((r) => ({
          studentId: r.profile == "student" ? r.id : null,
          contactId: r.profile == "contact" ? r.id : null,
          staffId: r.profile == "staff" ? r.id : null,
        })),
      },
      select: {
        staffId: true,
        contactId: true,
        studentId: true,
        channel: true,
        enabled: true,
      },
    });

    const preferenceMap = new Map<
      string,
      { hasAny: boolean; enabled: Set<NotificationChannel> }
    >();
    for (const key of recipientKeys) {
      preferenceMap.set(key, { hasAny: false, enabled: new Set() });
    }
    for (const pref of preferences) {
      const entityId = pref.staffId ?? pref.studentId ?? pref.contactId;
      if (!entityId) {
        throw Error(`Expected an entityId to be not null, found ${entityId}`);
      }
      const key = this.buildRecipientKey(
        entityId,
        pref.staffId ? "staff" : pref.studentId ? "student" : "contact",
      );
      const entry = preferenceMap.get(key);
      if (!entry) continue;
      entry.hasAny = true;
      if (pref.enabled) entry.enabled.add(pref.channel);
    }

    const subscriptions = await this.db.notificationSubscription.findMany({
      where: {
        status: "ACTIVE",
        channel: { in: METERED_CHANNELS },
        OR: recipientPairs.map((r) => ({
          studentId: r.profile == "student" ? r.id : null,
          contactId: r.profile == "contact" ? r.id : null,
          staffId: r.profile == "staff" ? r.id : null,
        })),
      },
      select: {
        studentId: true,
        contactId: true,
        staffId: true,
        channel: true,
        balance: true,
      },
    });

    const balanceMap = new Map<string, Map<NotificationChannel, number>>();
    for (const sub of subscriptions) {
      const entityId = sub.contactId ?? sub.staffId ?? sub.studentId;
      if (!entityId) {
        throw Error(`Expected an entityId to be not null, found ${entityId}`);
      }
      const key = this.buildRecipientKey(
        entityId,
        sub.studentId ? "student" : sub.contactId ? "contact" : "staff",
      );
      const byChannel =
        balanceMap.get(key) ?? new Map<NotificationChannel, number>();
      byChannel.set(
        sub.channel,
        (byChannel.get(sub.channel) ?? 0) + sub.balance,
      );
      balanceMap.set(key, byChannel);
    }

    const resolutions = new Map<string, ChannelResolution>();
    for (const recipient of recipientPairs) {
      const key = this.buildRecipientKey(recipient.id, recipient.profile);
      const pref = preferenceMap.get(key);
      const requestedChannels =
        pref?.hasAny === true
          ? pref.enabled
          : new Set<NotificationChannel>(DEFAULT_FREE_CHANNELS);
      const eligible: NotificationChannel[] = [];
      const ineligible: { channel: NotificationChannel; reason: string }[] = [];

      for (const channel of requestedChannels) {
        if (METERED_CHANNELS.includes(channel)) {
          const balanceForRecipient = balanceMap.get(key);
          const balance = balanceForRecipient?.get(channel);
          if (balance == null) {
            ineligible.push({ channel, reason: "No active subscription" });
            continue;
          }
          if (balance <= 0) {
            ineligible.push({ channel, reason: "Insufficient credit" });
            continue;
          }
        }
        eligible.push(channel);
      }

      resolutions.set(key, { eligible, ineligible });
    }

    return resolutions;
  }

  private buildRecipientKey(
    id: string,
    profile: "student" | "contact" | "staff",
  ) {
    return `${profile}:${id}`;
  }

  async notify(params: {
    schoolId: string;
    recipient: Recipient;
    sourceType: NotificationSourceType;
    sourceId: string;
    templateId: string;
    payload: Record<string, unknown>;
  }) {
    const { schoolId, recipient, sourceType, sourceId, templateId, payload } =
      params;
    // 1) Create or get Notification (unique constraint prevents duplicates)
    const notification = await this.db.notification.upsert({
      where: {
        schoolId_recipientId_sourceType_sourceId: {
          schoolId,
          recipientId: recipient.id,
          sourceType,
          sourceId,
        },
      },
      create: {
        schoolId,
        recipientId: recipient.id,
        sourceType,
        sourceId,
        templateId,
        payload: payload as Prisma.JsonObject,
      },
      update: {
        // Optional policy:
        templateId,
        // if re-triggered, update payload/templateId to latest.
        payload: payload as Prisma.JsonObject,
      },
    });
    // 2) Resolve channels: school rules + recipient subscription + credit
    const resolutions = await this.resolveChannelsForRecipients({
      recipients: [{ id: recipient.id, profile: recipient.profile }],
      sourceType,
    });
    const resolution = resolutions.get(
      this.buildRecipientKey(recipient.id, recipient.profile),
    ) ?? { eligible: [], ineligible: [] };

    return this.deliverNotification({
      notificationId: notification.id,
      recipient,
      templateId,
      payload,
      eligible: resolution.eligible,
    });
  }

  async notifyMany(params: {
    schoolId: string;
    sourceType: NotificationSourceType;
    items: {
      recipient: Recipient;
      sourceId: string;
      templateId: string;
      payload: Record<string, unknown>;
    }[];
  }) {
    const { schoolId, sourceType, items } = params;
    if (items.length === 0) return [];

    const resolutions = await this.resolveChannelsForRecipients({
      recipients: items.map((item) => ({
        id: item.recipient.id,
        profile: item.recipient.profile,
      })),
      sourceType,
    });

    const notifications = await this.db.$transaction(
      items.map((item) =>
        this.db.notification.upsert({
          where: {
            schoolId_recipientId_sourceType_sourceId: {
              schoolId,
              recipientId: item.recipient.id,
              sourceType,
              sourceId: item.sourceId,
            },
          },
          create: {
            schoolId,
            recipientId: item.recipient.id,
            sourceType,
            sourceId: item.sourceId,
            templateId: item.templateId,
            payload: item.payload as Prisma.JsonObject,
          },
          update: {
            templateId: item.templateId,
            payload: item.payload as Prisma.JsonObject,
          },
        }),
      ),
    );

    const results = [];
    for (const [index, notification] of notifications.entries()) {
      const item = items[index];
      if (!item) continue;
      const key = this.buildRecipientKey(
        item.recipient.id,
        item.recipient.profile,
      );
      const resolution = resolutions.get(key) ?? {
        eligible: [],
        ineligible: [],
      };
      const delivered = await this.deliverNotification({
        notificationId: notification.id,
        recipient: item.recipient,
        templateId: item.templateId,
        payload: item.payload,
        eligible: resolution.eligible,
      });
      results.push(delivered);
    }

    return results;
  }

  private async deliverNotification(params: {
    notificationId: string;
    recipient: Recipient;
    templateId: string;
    payload: Record<string, unknown>;
    eligible: NotificationChannel[];
  }) {
    const { notificationId, recipient, templateId, payload, eligible } = params;
    const actionable = eligible.filter((channel) => {
      if (channel === "EMAIL") return Boolean(recipient.email);
      if (channel === "SMS" || channel === "WHATSAPP") {
        return Boolean(recipient.phone);
      }
      return true;
    });

    if (actionable.length === 0) {
      return this.db.notification.findUniqueOrThrow({
        where: { id: notificationId },
        include: { deliveries: true },
      });
    }

    const rendered = await renderTemplateFromDb({
      db: this.db,
      templateId,
      payload: payload,
      throwOnMissingPayload: true,
    });

    for (const channel of actionable) {
      if (channel === "IN_APP") {
        await this.db.notificationDelivery.upsert({
          where: {
            notificationId_channel: {
              notificationId,
              channel,
            },
          },
          create: {
            notificationId,
            channel,
            status: "SENT",
            sentAt: new Date(),
          },
          update: {
            status: "SENT",
            sentAt: new Date(),
            error: null,
            skipReason: null,
          },
        });
        continue;
      }

      if (channel === "EMAIL" && !recipient.email) {
        continue;
      }
      if ((channel === "SMS" || channel === "WHATSAPP") && !recipient.phone) {
        continue;
      }
      const delivery = await this.db.$transaction(async (tx) => {
        if (METERED_CHANNELS.includes(channel)) {
          const subscription = await tx.notificationSubscription.findFirst({
            where: {
              staffId: recipient.profile == "staff" ? recipient.id : null,
              contactId: recipient.profile == "contact" ? recipient.id : null,
              studentId: recipient.profile == "student" ? recipient.id : null,
              channel,
              status: "ACTIVE",
              balance: { gt: 0 },
            },
            orderBy: { balance: "desc" },
            select: { id: true },
          });

          if (!subscription) {
            return null;
          }

          await tx.notificationSubscription.update({
            where: { id: subscription.id },
            data: { balance: { decrement: 1 } },
          });
        }

        return tx.notificationDelivery.upsert({
          where: {
            notificationId_channel: {
              notificationId,
              channel,
            },
          },
          create: {
            notificationId,
            channel,
            status: "PENDING",
            attemptCount: 0,
          },
          update: {
            status: "PENDING",
            error: null,
          },
        });
      });
      if (!delivery) continue;
      try {
        const bodyText = rendered.body;
        const subject = rendered.subject ?? "Notification";

        let res: { provider: string; providerMsgId: string } | null = null;
        if (channel === "EMAIL" && recipient.email) {
          res = await sendEmail({
            toEmail: recipient.email,
            subject,
            bodyText,
          });
        } else if (channel === "SMS" && recipient.phone) {
          res = await sendSms({ toPhone: recipient.phone, bodyText });
        } else if (channel === "WHATSAPP" && recipient.phone) {
          res = await sendWhatsapp({ toPhone: recipient.phone, bodyText });
        }

        await this.db.notificationDelivery.update({
          where: { id: delivery.id },
          data: {
            status: "SENT",
            provider: res?.provider,
            providerMsgId: res?.providerMsgId,
            sentAt: new Date(),
            error: null,
            skipReason: null,
            attemptCount: { increment: 1 },
          },
        });
      } catch (err) {
        const error = err as Error;
        await this.db.notificationDelivery.update({
          where: { id: delivery.id },
          data: {
            status: "FAILED",
            error: error.message,
            attemptCount: { increment: 1 },
          },
        });
      }
    }

    return this.db.notification.findUniqueOrThrow({
      where: { id: notificationId },
      include: { deliveries: true },
    });
  }
}

const VAR_EXTRACT_REGEX = /{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/g;
export function extractTemplateVars(input: string | null): string[] {
  if (!input) return [];

  const seen = new Set<string>();
  const vars: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = VAR_EXTRACT_REGEX.exec(input)) !== null) {
    const key = match[1];
    if (!key) continue;
    if (!seen.has(key)) {
      seen.add(key);
      vars.push(key);
    }
  }
  return vars;
}
