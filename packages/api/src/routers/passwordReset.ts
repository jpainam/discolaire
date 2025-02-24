import { z } from "zod";

import { hashPassword } from "@repo/auth/session";
import { ratelimiter } from "../rateLimit";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const passwordResetRouter = createTRPCRouter({
  reset: protectedProcedure
    .input(z.object({ userId: z.string(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          password: await hashPassword(input.password),
        },
      });
    }),
  createResetCode: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        resetCode: z.string().min(1),
        expiresAt: z.date(),
      }),
    )
    .use(ratelimiter({ limit: 5, namespace: "reset.code.password" }))
    .mutation(({ input, ctx }) => {
      return ctx.db.passwordReset.upsert({
        where: { userId: input.userId },
        update: { resetCode: input.resetCode, expiresAt: input.expiresAt },
        create: {
          userId: input.userId,
          resetCode: input.resetCode,
          expiresAt: input.expiresAt,
        },
      });
    }),
  getByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.passwordReset.findFirst({
        where: {
          user: { email: input.email },
          expiresAt: { gte: new Date() },
        },
        include: { user: true },
      });
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    return ctx.db.passwordReset.delete({ where: { id: input } });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.term.findMany({
      orderBy: {
        startDate: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
});
