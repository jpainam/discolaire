import type { TRPCRouterRecord } from "@trpc/server";
import * as z from "zod";

import { NotificationSourceType } from "@repo/db/enums";

import { protectedProcedure } from "../trpc";

export const notificationRouter = {
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(20),
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
      return ctx.db.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        include: {
          deliveries: true,
        },
        where: {
          schoolId: ctx.schoolId,
          ...(recipientId ? { recipientId } : {}),
        },
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
