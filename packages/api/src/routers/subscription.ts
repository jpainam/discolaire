import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subscriptionRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        sms: z.number().default(0),
        email: z.number().default(0),
        whatsapp: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subsc = await ctx.db.subscription.findUnique({
        where: {
          userId: input.userId,
        },
      });
      return ctx.db.subscription.upsert({
        where: {
          userId: input.userId,
        },
        update: {
          sms: input.sms + (subsc?.sms ?? 0),
          email: input.email + (subsc?.email ?? 0),
          whatsapp: input.whatsapp + (subsc?.whatsapp ?? 0),
        },
        create: {
          userId: input.userId,
          sms: input.sms,
          email: input.email,
          whatsapp: input.whatsapp,
          createdById: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  clearAll: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.subscription.deleteMany({
      where: {
        user: {
          schoolId: ctx.schoolId,
        },
      },
    });
  }),
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
    .query(({ ctx, input }) => {
      return ctx.db.subscription.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        include: {
          user: true,
        },
        where: {
          user: {
            schoolId: ctx.schoolId,
          },
        },
      });
    }),
});
