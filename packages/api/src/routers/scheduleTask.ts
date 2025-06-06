import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const scheduleTaskRouter = {
  byName: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.scheduleTask.findMany({
        where: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          name: input.name,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        cron: z.string().min(1),
        data: z.record(z.string().min(1), z.any()),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.scheduleTask.create({
        data: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          name: input.name,
          data: input.data,
          cron: input.cron,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.scheduleTask.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        name: z.string().min(1),
        data: z.record(z.string().min(1), z.any()),
        cron: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.scheduleTask.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          cron: input.cron,
          data: input.data,
        },
      });
    }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.scheduleTask.findMany({
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
} satisfies TRPCRouterRecord;
