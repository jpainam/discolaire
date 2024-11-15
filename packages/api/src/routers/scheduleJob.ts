import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const scheduleJobRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.scheduleJob.findMany({
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
  byType: protectedProcedure
    .input(
      z.object({
        type: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.scheduleJob.findMany({
        include: {
          user: true,
        },
        where: {
          user: {
            schoolId: ctx.schoolId,
          },
          type: input.type,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.scheduleJob.delete({
        where: {
          id: input,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        cron: z.string().min(1),
        timezone: z.string().min(1),
        type: z.string().min(1),
        triggerDevId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.scheduleJob.create({
        data: {
          ...input,
          userId: input.userId,
        },
      });
    }),
});
