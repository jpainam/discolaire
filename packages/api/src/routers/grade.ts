import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const gradeRouter = {
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.grade.delete({
        where: {
          id: input,
        },
      });
    }),
  get: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.grade.findUnique({
        include: {
          gradeSheet: {
            include: {
              term: true,
              subject: {
                include: {
                  teacher: true,
                  course: true,
                },
              },
            },
          },
        },
        where: {
          id: input,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        gradeSheetId: z.coerce.number(),
        grade: z.coerce.number(),
        isAbsent: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const gradesheet = await ctx.db.gradeSheet.findUniqueOrThrow({
        where: {
          id: input.gradeSheetId,
        },
      });
      if (input.grade > gradesheet.scale) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `La note doit etre < ${gradesheet.scale}`,
        });
      }
      const grade = await ctx.db.grade.findFirst({
        where: {
          studentId: input.studentId,
          gradeSheetId: input.gradeSheetId,
        },
      });
      if (grade) {
        return ctx.db.grade.update({
          data: {
            grade: input.grade,
            isAbsent: input.isAbsent,
          },
          where: {
            id: grade.id,
          },
        });
      }
      return ctx.db.grade.create({
        data: {
          gradeSheetId: input.gradeSheetId,
          grade: input.grade,
          isAbsent: input.isAbsent,
          studentId: input.studentId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        grade: z.number(),
        isAbsent: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.grade.update({
        where: {
          id: input.id,
        },
        data: {
          grade: input.isAbsent ? 0 : input.grade,
          isAbsent: input.isAbsent,
        },
      });
    }),
} satisfies TRPCRouterRecord;
