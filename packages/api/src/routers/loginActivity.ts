import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const loginActivityRouter = createTRPCRouter({
  login: protectedProcedure.query(({ ctx }) => {
    return ctx.db.loginActivity.create({
      data: {
        userId: ctx.session.user.id,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        loginDate: new Date(),
      },
    });
  }),
  logout: protectedProcedure.query(async ({ ctx }) => {
    const lastLogin = await ctx.db.loginActivity.findFirst({
      where: {
        userId: ctx.session.user.id,
        logoutDate: null,
      },
      orderBy: {
        loginDate: "desc",
      },
    });
    if (!lastLogin) {
      return null;
    }
    return ctx.db.loginActivity.update({
      where: {
        id: lastLogin.id,
      },
      data: {
        logoutDate: new Date(),
      },
    });
  }),
  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.loginActivity.deleteMany({
        where: {
          userId: input.userId,
        },
      });
    }),
  all: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.loginActivity.findMany({
        take: input.limit,
        where: {
          userId: input.userId,
        },
        include: {
          user: true,
        },
        orderBy: {
          loginDate: "desc",
        },
      });
    }),
});
