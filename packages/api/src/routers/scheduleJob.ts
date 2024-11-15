import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const scheduleJobRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.scheduleJob.findMany({
      where: {
        user: {
          schoolId: ctx.schoolId,
        },
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
