import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const userNotificationRouter = {
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx }) => {
      return await ctx.db.userNotification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          schoolYearId: ctx.schoolYearId,
          user: {
            schoolId: ctx.schoolId,
          },
        },
      });
    }),

  udpateRead: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        read: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.userNotification.update({
        where: {
          id: input.id,
        },
        data: {
          read: input.read,
        },
      });
    }),

  user: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.userNotification.findMany({
        where: {
          schoolYearId: ctx.schoolYearId,
          user: {
            id: input.userId,
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
