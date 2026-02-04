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
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        include: {
          deliveries: true,
        },
        where: {
          ...(input.recipientId ? { recipientId: input.recipientId } : {}),
        },
      });
    }),
  getStatuses: protectedProcedure
    .input(
      z.object({
        sourceType: z.enum(NotificationSourceType),
        sourceIds: z.string().array(),
        recipientId: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.services.notification.getStatuses({
        sourceIds: input.sourceIds,
        sourceType: input.sourceType,
        schoolId: ctx.schoolId,
      });
    }),
} satisfies TRPCRouterRecord;
