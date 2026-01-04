import type { NotificationSourceType, Prisma, PrismaClient } from "@repo/db";
import { NotificationChannel, NotificationStatus } from "@repo/db";

import { sendEmail, sendSms, sendWhatsapp } from "../notifications/providers";
import { renderTemplateFromDb } from "../notifications/template";

const METERED_CHANNELS: NotificationChannel[] = ["SMS", "WHATSAPP"];

interface Recipient {
  id: string;
  phone?: string | null;
  email?: string | null;
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
    sourceType: NotificationSourceType;
  }) {
    const { recipientId, sourceType } = params;
    const subscriptions = await this.db.notificationSubscription.findMany({
      where: {
        entityId: recipientId,
        status: "ACTIVE",
      },
      select: {
        channel: true,
        balance: true,
      },
    });
    const subscribedSet = new Set(subscriptions.map((s) => s.channel));
    const balanceMap = new Map<NotificationChannel, number>();
    for (const { channel, balance } of subscriptions) {
      balanceMap.set(channel, (balanceMap.get(channel) ?? 0) + balance);
    }

    const preferences = await this.db.notificationPreference.findMany({
      where: {
        entityId: recipientId,
        sourceType: sourceType,
      },
    });
    const preferencesSet = new Set(preferences.map((p) => p.channel));
    const eligible: NotificationChannel[] = [];
    const ineligible: {
      channel: NotificationChannel | null;
      reason: string;
    }[] = [];

    const channels = Object.values(NotificationChannel);
    for (const ch of channels) {
      if (!preferencesSet.has(ch)) {
        ineligible.push({ channel: ch, reason: "Not prefered" });
        continue;
      }
      if (!subscribedSet.has(ch)) {
        ineligible.push({ channel: ch, reason: "Not subscribed" });
        continue;
      }
      if (METERED_CHANNELS.includes(ch)) {
        const bal = balanceMap.get(ch);
        if (!bal) {
          ineligible.push({ channel: ch, reason: "No balance record" });
          continue;
        }
        if (bal <= 0) {
          ineligible.push({ channel: ch, reason: "Insufficient credit" });
          continue;
        }
      }
      eligible.push(ch);
    }
    return { eligible, ineligible };
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
    const { eligible, ineligible } = await this.resolveChannels({
      recipientId: recipient.id,
      sourceType,
    });
    // 2) Ensure delivery rows exist for requested channels
    await this.db.$transaction(
      ineligible
        .filter((x) => x.channel != null)
        .map((x) =>
          this.db.notificationDelivery.upsert({
            where: {
              notificationId_channel: {
                notificationId: notification.id,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                channel: x.channel!,
              },
            },
            create: {
              notificationId: notification.id,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              channel: x.channel!,
              skipReason: x.reason,
              status: NotificationStatus.SKIPPED,
            },
            update: {
              status: "SKIPPED",
              skipReason: x.reason,
            },
          }),
        ),
    );
    if (eligible.length === 0) {
      return this.db.notification.findUniqueOrThrow({
        where: { id: notification.id },
        include: { deliveries: true },
      });
    }
    // // Refresh deliveries after upserts
    // const fresh = await this.db.notification.findUniqueOrThrow({
    //   where: { id: notification.id },
    //   include: { deliveries: true },
    // });
    // 3) Send any channels that are not SENT (or are FAILED/PENDING)
    const rendered = await renderTemplateFromDb({
      db: this.db,
      templateId,
      payload: payload,
      throwOnMissingPayload: true, // strict for production sends
    });

    for (const channel of eligible) {
      if (channel === "EMAIL" && !recipient.email) {
        await this.db.notificationDelivery.upsert({
          where: {
            notificationId_channel: {
              notificationId: notification.id,
              channel,
            },
          },
          create: {
            notificationId: notification.id,
            channel,
            status: "SKIPPED",
            skipReason: "Recipient has no email.",
          },
          update: { status: "SKIPPED", skipReason: "Recipient has no email." },
        });
        continue;
      }
      if ((channel === "SMS" || channel === "WHATSAPP") && !recipient.phone) {
        await this.db.notificationDelivery.upsert({
          where: {
            notificationId_channel: {
              notificationId: notification.id,
              channel,
            },
          },
          create: {
            notificationId: notification.id,
            channel,
            status: "SKIPPED",
            skipReason: "Recipient has no phone.",
          },
          update: { status: "SKIPPED", skipReason: "Recipient has no phone." },
        });
        continue;
      }
      // 5a) Reserve/decrement credit + mark delivery PENDING atomically (metered channels)
      const delivery = await this.db.$transaction(async (tx) => {
        if (METERED_CHANNELS.includes(channel)) {
          const updated = await tx.notificationSubscription.updateMany({
            where: {
              entityId: recipient.id,
              channel,
              balance: { gt: 0 },
            },
            data: { balance: { decrement: 1 } },
          });

          if (updated.count === 0) {
            // credit exhausted between selection and sending
            await tx.notificationDelivery.upsert({
              where: {
                notificationId_channel: {
                  notificationId: notification.id,
                  channel,
                },
              },
              create: {
                notificationId: notification.id,
                channel,
                status: "SKIPPED",
                skipReason: "Insufficient credit (race).",
              },
              update: {
                status: "SKIPPED",
                skipReason: "Insufficient credit (race).",
              },
            });
            return null;
          }
        }

        return tx.notificationDelivery.upsert({
          where: {
            notificationId_channel: {
              notificationId: notification.id,
              channel,
            },
          },
          create: {
            notificationId: notification.id,
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
      // 5b) Send and update status
      try {
        const bodyText = rendered.body;
        const subject = rendered.subject ?? "Notification";

        let res: { provider: string; providerMsgId: string } | null = null;
        if (channel === "EMAIL") {
          res = await sendEmail({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            toEmail: recipient.email!,
            subject,
            bodyText,
          });
        } else if (channel === "SMS") {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          res = await sendSms({ toPhone: recipient.phone!, bodyText });
        } else if (channel === "WHATSAPP") {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          res = await sendWhatsapp({ toPhone: recipient.phone!, bodyText });
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
        // When failed, i'll use the provider callback to refund (i.e, increment back)
      }
    }
    return this.db.notification.findUniqueOrThrow({
      where: { id: notification.id },
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
