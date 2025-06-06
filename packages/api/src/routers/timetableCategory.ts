import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const timetableCategoryRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.timetableCategory.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.timetableCategory.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.timetableCategory.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.timetableCategory.delete({
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
