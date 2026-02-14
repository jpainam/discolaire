import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

const asEntityProfile = (
  value: string,
): "student" | "staff" | "contact" | null => {
  if (value === "student" || value === "staff" || value === "contact") {
    return value;
  }
  return null;
};

const toTitle = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

const getPayloadRecord = (payload: unknown): Record<string, unknown> => {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }
  return {};
};

const getMessageFromPayload = (
  payload: unknown,
  sourceId: string,
): string => {
  const record = getPayloadRecord(payload);
  const directMessage =
    (typeof record.message === "string" && record.message) ||
    (typeof record.body === "string" && record.body) ||
    (typeof record.content === "string" && record.content) ||
    (typeof record.description === "string" && record.description);
  if (directMessage) {
    return directMessage;
  }

  const studentName =
    typeof record.studentName === "string" ? record.studentName : null;
  const date = typeof record.date === "string" ? record.date : null;
  if (studentName && date) {
    return `${studentName} (${date})`;
  }
  if (studentName) {
    return studentName;
  }

  return `Reference: ${sourceId}`;
};

export const userNotificationRouter = {
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const profile = asEntityProfile(ctx.session.user.profile);
      if (!profile) {
        return [];
      }
      const entity = await ctx.services.user.getEntityFromUser(
        ctx.session.user.id,
        profile,
      );
      if (!entity.entityId) {
        return [];
      }
      const recipient = await ctx.services.notification.syncRecipientFromEntity({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: entity.entityId,
          profile: entity.entityType,
        },
      });

      const notifications = await ctx.db.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        where: {
          schoolId: ctx.schoolId,
          recipientId: recipient.id,
          deliveries: {
            some: {
              channel: "IN_APP",
            },
          },
        },
        include: {
          template: {
            select: {
              name: true,
            },
          },
          deliveries: {
            where: {
              channel: "IN_APP",
            },
            select: {
              id: true,
              events: {
                where: {
                  type: "READ",
                },
                select: {
                  id: true,
                },
                take: 1,
              },
            },
          },
        },
      });

      return notifications.map((notification) => {
        const inAppDelivery = notification.deliveries[0];
        return {
          id: notification.id,
          title: notification.template?.name ?? toTitle(notification.sourceType),
          message: getMessageFromPayload(
            notification.payload,
            notification.sourceId,
          ),
          read: (inAppDelivery?.events.length ?? 0) > 0,
          createdAt: notification.createdAt,
        };
      });
    }),

  udpateRead: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        read: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profile = asEntityProfile(ctx.session.user.profile);
      if (!profile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No notification recipient linked to this account.",
        });
      }
      const entity = await ctx.services.user.getEntityFromUser(
        ctx.session.user.id,
        profile,
      );
      if (!entity.entityId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipient not found.",
        });
      }

      const recipient = await ctx.services.notification.syncRecipientFromEntity({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: entity.entityId,
          profile: entity.entityType,
        },
      });

      const delivery = await ctx.db.notificationDelivery.findFirst({
        where: {
          notificationId: input.id,
          channel: "IN_APP",
          notification: {
            schoolId: ctx.schoolId,
            recipientId: recipient.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (!delivery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found.",
        });
      }

      if (input.read) {
        const alreadyRead = await ctx.db.notificationEvent.findFirst({
          where: {
            deliveryId: delivery.id,
            type: "READ",
          },
          select: {
            id: true,
          },
        });
        if (!alreadyRead) {
          await ctx.db.notificationEvent.create({
            data: {
              deliveryId: delivery.id,
              type: "READ",
              data: {
                userId: ctx.session.user.id,
              },
            },
          });
        }
      } else {
        await ctx.db.notificationEvent.deleteMany({
          where: {
            deliveryId: delivery.id,
            type: "READ",
          },
        });
      }

      return {
        id: input.id,
        read: input.read,
      };
    }),

  user: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access your own notifications.",
        });
      }

      const profile = asEntityProfile(ctx.session.user.profile);
      if (!profile) {
        return [];
      }
      const entity = await ctx.services.user.getEntityFromUser(
        ctx.session.user.id,
        profile,
      );
      if (!entity.entityId) {
        return [];
      }
      const recipient = await ctx.services.notification.syncRecipientFromEntity({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: entity.entityId,
          profile: entity.entityType,
        },
      });

      const notifications = await ctx.db.notification.findMany({
        where: {
          schoolId: ctx.schoolId,
          recipientId: recipient.id,
          deliveries: {
            some: {
              channel: "IN_APP",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        include: {
          template: {
            select: {
              name: true,
            },
          },
          deliveries: {
            where: {
              channel: "IN_APP",
            },
            select: {
              id: true,
              events: {
                where: {
                  type: "READ",
                },
                select: {
                  id: true,
                },
                take: 1,
              },
            },
          },
        },
      });

      return notifications.map((notification) => {
        const inAppDelivery = notification.deliveries[0];
        return {
          id: notification.id,
          title: notification.template?.name ?? toTitle(notification.sourceType),
          message: getMessageFromPayload(
            notification.payload,
            notification.sourceId,
          ),
          read: (inAppDelivery?.events.length ?? 0) > 0,
          createdAt: notification.createdAt,
        };
      });
    }),
} satisfies TRPCRouterRecord;
