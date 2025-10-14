import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const gradeAppreciationRouter = {
  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.gradeAppreciation.delete({ where: { id: input } });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.gradeAppreciation.findMany({
      orderBy: {
        minGrade: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        appreciation: z.string().min(1),
        minGrade: z.number().min(0),
        maxGrade: z.number().min(0),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.gradeAppreciation.update({
        where: {
          id: input.id,
        },
        data: {
          appreciation: input.appreciation,
          minGrade: input.minGrade,
          maxGrade: input.maxGrade,
        },
      });
    }),
  classroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.gradeAppreciation.findMany({
        orderBy: {
          minGrade: "asc",
        },
        where: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          classroomAppreciations: {
            some: {
              classroomId: input.classroomId,
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        appreciation: z.string().min(1),
        minGrade: z.number().min(0),
        maxGrade: z.number().min(0),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.gradeAppreciation.create({
        data: {
          appreciation: input.appreciation,
          minGrade: input.minGrade,
          maxGrade: input.maxGrade,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
