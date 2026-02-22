import type {
  NotificationChannel,
  NotificationRecipientProfile,
  NotificationSourceType,
  NotificationStatus,
  Prisma,
  PrismaClient,
} from "@repo/db";

import { emailQueue } from "../notifications/email-queue";
import { sendSms } from "../notifications/providers";
import { sendWhatsapp } from "../notifications/whatsapp";

const DEFAULT_FREE_CHANNELS: NotificationChannel[] = ["EMAIL", "IN_APP"];
const METERED_CHANNELS: NotificationChannel[] = ["SMS", "WHATSAPP"];

interface Recipient {
  entityId: string;
  profile: "staff" | "contact" | "student";
}

interface RecipientRecord {
  id: string;
  entityId: string;
  profile: NotificationRecipientProfile;
  primaryEmail: string | null;
  primaryPhone: string | null;
}

interface ChannelResolution {
  eligible: NotificationChannel[];
  ineligible: { channel: NotificationChannel; reason: string }[];
}
export class NotificationService {
  private db: PrismaClient;
  private tenant: string;

  constructor(db: PrismaClient, tenant: string) {
    this.db = db;
    this.tenant = tenant;
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
    schoolId: string;
    recipientEntityId: string;
    recipientProfile: "student" | "staff" | "contact";
    sourceType: NotificationSourceType;
  }) {
    const resolutions = await this.resolveChannelsForRecipients({
      schoolId: params.schoolId,
      recipients: [
        {
          entityId: params.recipientEntityId,
          profile: params.recipientProfile,
        },
      ],
      sourceType: params.sourceType,
    });
    const key = this.buildRecipientKey(
      params.recipientEntityId,
      params.recipientProfile,
    );
    return resolutions.get(key) ?? { eligible: [], ineligible: [] };
  }

  async resolveChannelsForRecipients(params: {
    schoolId: string;
    recipients: Pick<Recipient, "entityId" | "profile">[];
    sourceType: NotificationSourceType;
  }) {
    const uniqueRecipients = new Map<
      string,
      Pick<Recipient, "entityId" | "profile">
    >();
    for (const recipient of params.recipients) {
      uniqueRecipients.set(
        this.buildRecipientKey(recipient.entityId, recipient.profile),
        recipient,
      );
    }
    const recipientPairs = Array.from(uniqueRecipients.values());
    const recipientKeys = new Set(
      recipientPairs.map((r) => this.buildRecipientKey(r.entityId, r.profile)),
    );

    const recipientRecords = await this.ensureRecipients({
      schoolId: params.schoolId,
      recipients: recipientPairs,
    });
    const recipientById = new Map(recipientRecords.map((r) => [r.id, r]));

    const preferences = await this.db.notificationPreference.findMany({
      where: {
        sourceType: params.sourceType,
        recipientId: { in: recipientRecords.map((r) => r.id) },
      },
      select: {
        recipientId: true,
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
      const recipient = recipientById.get(pref.recipientId);
      if (!recipient) continue;
      const key = this.buildRecipientKey(
        recipient.entityId,
        this.fromProfileEnum(recipient.profile),
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
        recipientId: { in: recipientRecords.map((r) => r.id) },
      },
      select: {
        recipientId: true,
        channel: true,
        balance: true,
      },
    });

    const balanceMap = new Map<string, Map<NotificationChannel, number>>();
    for (const sub of subscriptions) {
      const recipient = recipientById.get(sub.recipientId);
      if (!recipient) continue;
      const key = this.buildRecipientKey(
        recipient.entityId,
        this.fromProfileEnum(recipient.profile),
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
      const key = this.buildRecipientKey(recipient.entityId, recipient.profile);
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

  private toProfileEnum(
    profile: "student" | "contact" | "staff",
  ): NotificationRecipientProfile {
    return profile === "student"
      ? "STUDENT"
      : profile === "contact"
        ? "CONTACT"
        : "STAFF";
  }

  private fromProfileEnum(
    profile: NotificationRecipientProfile,
  ): "student" | "contact" | "staff" {
    return profile === "STUDENT"
      ? "student"
      : profile === "CONTACT"
        ? "contact"
        : "staff";
  }

  private async loadEntityContactInfo(params: {
    schoolId: string;
    profile: "student" | "contact" | "staff";
    entityId: string;
  }) {
    if (params.profile === "student") {
      const student = await this.db.student.findFirst({
        where: { id: params.entityId, schoolId: params.schoolId },
        select: { phoneNumber: true, userId: true },
      });
      if (!student) return null;
      return {
        primaryEmail: null,
        primaryPhone: student.phoneNumber ?? null,
        userId: student.userId ?? null,
      };
    }
    if (params.profile === "contact") {
      const contact = await this.db.contact.findFirst({
        where: { id: params.entityId, schoolId: params.schoolId },
        select: {
          email: true,
          phoneNumber1: true,
          phoneNumber2: true,
          userId: true,
        },
      });
      if (!contact) return null;
      return {
        primaryEmail: contact.email ?? null,
        primaryPhone: contact.phoneNumber1 ?? contact.phoneNumber2 ?? null,
        userId: contact.userId ?? null,
      };
    }
    const staff = await this.db.staff.findFirst({
      where: { id: params.entityId, schoolId: params.schoolId },
      select: {
        email: true,
        phoneNumber1: true,
        phoneNumber2: true,
        userId: true,
      },
    });
    if (!staff) return null;
    return {
      primaryEmail: staff.email ?? null,
      primaryPhone: staff.phoneNumber1 ?? staff.phoneNumber2 ?? null,
      userId: staff.userId ?? null,
    };
  }

  async ensureRecipient(params: { schoolId: string; recipient: Recipient }) {
    const existing = await this.db.notificationRecipient.findUnique({
      where: {
        schoolId_profile_entityId: {
          schoolId: params.schoolId,
          profile: this.toProfileEnum(params.recipient.profile),
          entityId: params.recipient.entityId,
        },
      },
      select: {
        id: true,
        entityId: true,
        profile: true,
        primaryEmail: true,
        primaryPhone: true,
      },
    });
    if (existing) return existing;

    const contactInfo = await this.loadEntityContactInfo({
      schoolId: params.schoolId,
      profile: params.recipient.profile,
      entityId: params.recipient.entityId,
    });
    if (!contactInfo) {
      throw new Error(
        `Recipient not found for ${params.recipient.profile}:${params.recipient.entityId}`,
      );
    }

    return this.db.notificationRecipient.create({
      data: {
        schoolId: params.schoolId,
        profile: this.toProfileEnum(params.recipient.profile),
        entityId: params.recipient.entityId,
        userId: contactInfo.userId,
        primaryEmail: contactInfo.primaryEmail,
        primaryPhone: contactInfo.primaryPhone,
      },
      select: {
        id: true,
        entityId: true,
        profile: true,
        primaryEmail: true,
        primaryPhone: true,
      },
    });
  }

  async syncRecipientFromEntity(params: {
    schoolId: string;
    recipient: Recipient;
  }) {
    const contactInfo = await this.loadEntityContactInfo({
      schoolId: params.schoolId,
      profile: params.recipient.profile,
      entityId: params.recipient.entityId,
    });
    if (!contactInfo) {
      throw new Error(
        `Recipient not found for ${params.recipient.profile}:${params.recipient.entityId}`,
      );
    }

    return this.db.notificationRecipient.upsert({
      where: {
        schoolId_profile_entityId: {
          schoolId: params.schoolId,
          profile: this.toProfileEnum(params.recipient.profile),
          entityId: params.recipient.entityId,
        },
      },
      create: {
        schoolId: params.schoolId,
        profile: this.toProfileEnum(params.recipient.profile),
        entityId: params.recipient.entityId,
        userId: contactInfo.userId,
        primaryEmail: contactInfo.primaryEmail,
        primaryPhone: contactInfo.primaryPhone,
      },
      update: {
        userId: contactInfo.userId,
        primaryEmail: contactInfo.primaryEmail,
        primaryPhone: contactInfo.primaryPhone,
      },
      select: {
        id: true,
        entityId: true,
        profile: true,
        primaryEmail: true,
        primaryPhone: true,
      },
    });
  }

  async ensureRecipients(params: {
    schoolId: string;
    recipients: Pick<Recipient, "entityId" | "profile">[];
  }) {
    const out: RecipientRecord[] = [];
    for (const recipient of params.recipients) {
      const record = await this.ensureRecipient({
        schoolId: params.schoolId,
        recipient,
      });
      out.push(record);
    }
    return out;
  }

  async notify(params: {
    schoolId: string;
    recipient: Recipient;
    sourceType: NotificationSourceType;
    sourceId: string;
    context: Record<string, unknown>;
  }) {
    const { schoolId, recipient, sourceType, sourceId, context } = params;
    const recipientRecord = await this.ensureRecipient({
      schoolId,
      recipient,
    });
    const notification = await this.db.notification.upsert({
      where: {
        schoolId_recipientId_sourceType_sourceId: {
          schoolId,
          recipientId: recipientRecord.id,
          sourceType,
          sourceId,
        },
      },
      create: {
        schoolId,
        recipientId: recipientRecord.id,
        sourceType,
        sourceId,
        context: context as Prisma.JsonObject,
      },
      update: {
        context: context as Prisma.JsonObject,
      },
    });
    const resolutions = await this.resolveChannelsForRecipients({
      schoolId,
      recipients: [
        { entityId: recipient.entityId, profile: recipient.profile },
      ],
      sourceType,
    });
    const resolution = resolutions.get(
      this.buildRecipientKey(recipient.entityId, recipient.profile),
    ) ?? { eligible: [], ineligible: [] };

    return this.deliverNotification({
      notificationId: notification.id,
      recipient: recipientRecord,
      sourceType,
      context,
      eligible: resolution.eligible,
      ineligible: resolution.ineligible,
    });
  }

  async notifyMany(params: {
    schoolId: string;
    sourceType: NotificationSourceType;
    items: {
      recipient: Recipient;
      sourceId: string;
      context: Record<string, unknown>;
    }[];
  }) {
    const { schoolId, sourceType, items } = params;
    if (items.length === 0) return [];

    const recipientRecords = await this.ensureRecipients({
      schoolId,
      recipients: items.map((item) => item.recipient),
    });
    const recipientMap = new Map(
      recipientRecords.map((r) => [
        this.buildRecipientKey(r.entityId, this.fromProfileEnum(r.profile)),
        r,
      ]),
    );
    const normalizedItems = items.map((item) => {
      const key = this.buildRecipientKey(
        item.recipient.entityId,
        item.recipient.profile,
      );
      const recipientRecord = recipientMap.get(key);
      if (!recipientRecord) {
        throw new Error(`Recipient not found for ${key}`);
      }
      return { item, recipientRecord, key };
    });

    const resolutions = await this.resolveChannelsForRecipients({
      schoolId,
      recipients: normalizedItems.map(({ item }) => ({
        entityId: item.recipient.entityId,
        profile: item.recipient.profile,
      })),
      sourceType,
    });

    const notifications = await this.db.$transaction(
      normalizedItems.map(({ item, recipientRecord }) =>
        this.db.notification.upsert({
          where: {
            schoolId_recipientId_sourceType_sourceId: {
              schoolId,
              recipientId: recipientRecord.id,
              sourceType,
              sourceId: item.sourceId,
            },
          },
          create: {
            schoolId,
            recipientId: recipientRecord.id,
            sourceType,
            sourceId: item.sourceId,
            context: item.context as Prisma.JsonObject,
          },
          update: {
            context: item.context as Prisma.JsonObject,
          },
        }),
      ),
    );

    const results = [];
    for (const [index, notification] of notifications.entries()) {
      const normalized = normalizedItems[index];
      if (!normalized) continue;
      const { item, key, recipientRecord } = normalized;
      const resolution = resolutions.get(key) ?? {
        eligible: [],
        ineligible: [],
      };
      const delivered = await this.deliverNotification({
        notificationId: notification.id,
        recipient: recipientRecord,
        sourceType,
        context: item.context,
        eligible: resolution.eligible,
        ineligible: resolution.ineligible,
      });
      results.push(delivered);
    }

    return results;
  }

  private async deliverNotification(params: {
    notificationId: string;
    recipient: RecipientRecord;
    sourceType: NotificationSourceType;
    context: Record<string, unknown>;
    eligible: NotificationChannel[];
    ineligible: { channel: NotificationChannel; reason: string }[];
  }) {
    const { notificationId, recipient, sourceType, context, eligible, ineligible } =
      params;
    for (const skipped of ineligible) {
      await this.db.notificationDelivery.upsert({
        where: {
          notificationId_channel: {
            notificationId,
            channel: skipped.channel,
          },
        },
        create: {
          notificationId,
          channel: skipped.channel,
          status: "SKIPPED",
          skipReason: skipped.reason,
        },
        update: {
          status: "SKIPPED",
          skipReason: skipped.reason,
          error: null,
        },
      });
    }
    const actionable = eligible.filter((channel) => {
      if (channel === "EMAIL") return Boolean(recipient.primaryEmail);
      if (channel === "SMS" || channel === "WHATSAPP") {
        return Boolean(recipient.primaryPhone);
      }
      return true;
    });

    for (const channel of eligible) {
      if (channel === "IN_APP") continue;
      if (channel === "EMAIL" && !recipient.primaryEmail) {
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
            status: "SKIPPED",
            skipReason: "Missing email",
          },
          update: {
            status: "SKIPPED",
            skipReason: "Missing email",
            error: null,
          },
        });
      }
      if (
        (channel === "SMS" || channel === "WHATSAPP") &&
        !recipient.primaryPhone
      ) {
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
            status: "SKIPPED",
            skipReason: "Missing phone",
          },
          update: {
            status: "SKIPPED",
            skipReason: "Missing phone",
            error: null,
          },
        });
      }
    }

    if (actionable.length === 0) {
      return this.db.notification.findUniqueOrThrow({
        where: { id: notificationId },
        include: { deliveries: true },
      });
    }

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

      if (channel === "EMAIL" && !recipient.primaryEmail) continue;
      if (
        (channel === "SMS" || channel === "WHATSAPP") &&
        !recipient.primaryPhone
      )
        continue;

      const delivery = await this.db.$transaction(async (tx) => {
        if (METERED_CHANNELS.includes(channel)) {
          const subscription = await tx.notificationSubscription.findFirst({
            where: {
              recipientId: recipient.id,
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

      if (channel === "EMAIL" && recipient.primaryEmail) {
        // Rendering happens in the worker (via @repo/transactional)
        // to keep the API package free of React/email template dependencies.
        await emailQueue.add("send-email", {
          deliveryId: delivery.id,
          tenant: this.tenant,
          toEmail: recipient.primaryEmail,
          sourceType: String(sourceType),
          context,
        });
        continue;
      }

      // SMS and WhatsApp: plain-text body assembled from context
      const smsBody = Object.entries(context)
        .filter(([, v]) => v !== null && v !== undefined && v !== 0 && v !== "0")
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(", ");

      try {
        let res: { provider: string; providerMsgId: string } | null = null;

        if (channel === "SMS" && recipient.primaryPhone) {
          res = await sendSms({
            toPhone: recipient.primaryPhone,
            bodyText: smsBody,
          });
        } else if (channel === "WHATSAPP" && recipient.primaryPhone) {
          res = await sendWhatsapp({
            toPhone: recipient.primaryPhone,
            bodyText: smsBody,
          });
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

