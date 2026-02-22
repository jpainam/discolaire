import type { TRPCRouterRecord } from "@trpc/server";
import * as z from "zod";

import type { Prisma } from "@repo/db";
import type {
  NotificationSourceType as NotificationSourceTypeEnum,
  NotificationStatus as NotificationStatusEnum,
} from "@repo/db/enums";
import {
  NotificationChannel,
  NotificationSourceType,
  NotificationStatus,
} from "@repo/db/enums";

import { protectedProcedure } from "../trpc";

const buildNotificationWhere = (params: {
  schoolId: string;
  recipientId?: string;
  query?: string;
  channel?: NotificationChannel;
  sourceType?: NotificationSourceTypeEnum;
  status?: NotificationStatusEnum;
}): Prisma.NotificationWhereInput => {
  const query = params.query?.trim();
  const searchFilter: Prisma.NotificationWhereInput = query
    ? {
        OR: [
          {
            sourceId: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            recipient: {
              primaryEmail: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            recipient: {
              primaryPhone: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            recipient: {
              entityId: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    : {};

  return {
    schoolId: params.schoolId,
    ...(params.recipientId ? { recipientId: params.recipientId } : {}),
    ...(params.sourceType ? { sourceType: params.sourceType } : {}),
    ...(params.status
      ? { deliveries: { some: { status: params.status } } }
      : {}),
    ...searchFilter,
  };
};

export const notificationRouter = {
  stats: protectedProcedure
    .input(
      z.object({
        recipientId: z.string(),
        recipientProfile: z.enum(["student", "staff", "contact"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const recipientId = (
        await ctx.services.notification.ensureRecipient({
          schoolId: ctx.schoolId,
          recipient: {
            entityId: input.recipientId,
            profile: input.recipientProfile,
          },
        })
      ).id;

      const notificationWhere: Prisma.NotificationWhereInput = {
        schoolId: ctx.schoolId,
        recipientId,
      };

      const [total, deliveryGroups] = await Promise.all([
        ctx.db.notification.count({ where: notificationWhere }),
        ctx.db.notificationDelivery.groupBy({
          by: ["status", "channel"],
          where: { notification: notificationWhere },
          _count: { _all: true },
        }),
      ]);

      let sent = 0;
      let failed = 0;
      let pending = 0;
      let skipped = 0;
      let canceled = 0;
      let smsCreditsUsed = 0;
      let whatsappCreditsUsed = 0;

      for (const group of deliveryGroups) {
        const count = group._count._all;
        if (group.status === "SENT") sent += count;
        if (group.status === "FAILED") failed += count;
        if (group.status === "PENDING") pending += count;
        if (group.status === "SKIPPED") skipped += count;
        if (group.status === "CANCELED") canceled += count;

        if (group.channel === "SMS") smsCreditsUsed += count;
        if (group.channel === "WHATSAPP") whatsappCreditsUsed += count;
      }

      return {
        total,
        sent,
        failed,
        pending,
        skipped,
        canceled,
        smsCreditsUsed,
        whatsappCreditsUsed,
      };
    }),
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(20),
        recipientId: z.string().optional(),
        recipientProfile: z.enum(["student", "staff", "contact"]).optional(),
        query: z.string().optional(),
        sourceType: z.enum(NotificationSourceType).optional(),
        status: z.enum(NotificationStatus).optional(),
        channel: z.enum(NotificationChannel).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const recipientId =
        input.recipientId && input.recipientProfile
          ? (
              await ctx.services.notification.ensureRecipient({
                schoolId: ctx.schoolId,
                recipient: {
                  entityId: input.recipientId,
                  profile: input.recipientProfile,
                },
              })
            ).id
          : input.recipientId;
      const notificationWhere = buildNotificationWhere({
        schoolId: ctx.schoolId,
        recipientId,
        query: input.query,
        sourceType: input.sourceType,
        status: input.status,
        channel: input.channel,
      });
      return ctx.db.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        include: {
          deliveries: true,
          recipient: true,
        },
        where: notificationWhere,
      });
    }),
  getStatuses: protectedProcedure
    .input(
      z.object({
        sourceType: z.enum(NotificationSourceType),
        sourceIds: z.string().array(),
        recipientId: z.string().optional(),
        recipientProfile: z.enum(["student", "staff", "contact"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const recipientId =
        input.recipientId && input.recipientProfile
          ? (
              await ctx.services.notification.ensureRecipient({
                schoolId: ctx.schoolId,
                recipient: {
                  entityId: input.recipientId,
                  profile: input.recipientProfile,
                },
              })
            ).id
          : input.recipientId;
      return ctx.services.notification.getStatuses({
        sourceIds: input.sourceIds,
        sourceType: input.sourceType,
        schoolId: ctx.schoolId,
        recipientId,
      });
    }),
} satisfies TRPCRouterRecord;
