import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subscriptionRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    const counts = await ctx.db.subscription.aggregate({
      _sum: {
        sms: true,
        email: true,
        whatsapp: true,
      },
      where: {
        user: {
          schoolId: ctx.schoolId,
        },
      },
    });
    return {
      sms: counts._sum.sms,
      email: counts._sum.email,
      whatsapp: counts._sum.whatsapp,
    };
  }),
  sum: protectedProcedure
    .input(z.object({ limit: z.number().optional().default(1000) }))
    .query(async ({ ctx, input }) => {
      const counts = await ctx.db.subscription.groupBy({
        by: ["userId"],
        _sum: {
          sms: true,
          email: true,
          whatsapp: true,
        },
        where: {
          user: {
            schoolId: ctx.schoolId,
          },
        },
      });
      const userIds = counts.map((count) => count.userId);
      const users = await ctx.db.user.findMany({
        take: input.limit,
        where: {
          id: { in: userIds },
          schoolId: ctx.schoolId,
        },
      });
      return counts.map((count) => {
        const user = users.find((user) => user.id === count.userId);
        return {
          ...user,
          sms: count._sum.sms,
          email: count._sum.email,
          whatsapp: count._sum.whatsapp,
        };
      });
    }),
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(100),
      }),
    )
    .query(({ ctx }) => {
      return ctx.db.subscription.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          user: {
            schoolId: ctx.schoolId,
          },
        },
      });
    }),
});
