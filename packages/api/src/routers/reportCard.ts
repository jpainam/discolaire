import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const reportCardRouter = {
  getRemarks: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.reportCard.findMany({
        where: {
          classroomId: input.classroomId,
          termId: input.termId,
        },
      });
    }),

  deleteRemark: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        classroomId: z.string(),
        termId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.reportCard.delete({
        where: {
          studentId_classroomId_termId: {
            studentId: input.studentId,
            classroomId: input.classroomId,
            termId: input.termId,
          },
        },
      });
    }),
  upsertRemark: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        classroomId: z.string(),
        termId: z.string().min(1),
        remark: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.reportCard.upsert({
        where: {
          studentId_classroomId_termId: {
            studentId: input.studentId,
            classroomId: input.classroomId,
            termId: input.termId,
          },
        },
        update: {
          createdById: ctx.session.user.id,
          remark: input.remark,
        },
        create: {
          studentId: input.studentId,
          classroomId: input.classroomId,
          termId: input.termId,
          createdById: ctx.session.user.id,
          remark: input.remark,
        },
      });
    }),
  getSequence: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const results = await ctx.services.sequence.getSequenceGrades(
        input.classroomId,
        input.termId,
      );
      const { globalRanks } = results;
      const d = Array.from(globalRanks).map(([key, value]) => {
        return {
          studentId: key,
          average: Number(value.average.toFixed(2)),
          rank: value.rank,
        };
      });
      await ctx.services.academicSnapshot.create({
        classroomId: input.classroomId,
        termId: input.termId,
        reportcards: d,
      });
      return results;
    }),
  getTrimestre: protectedProcedure
    .input(
      z.object({
        termId: z.string().min(1),
        classroomId: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const results = await ctx.services.trimestre.getTrimestreGrades(
        input.classroomId,
        input.termId,
        ctx.schoolId,
        ctx.schoolYearId,
      );
      const { globalRanks } = results;
      const d = Array.from(globalRanks).map(([key, value]) => {
        return {
          studentId: key,
          average: Number(value.average.toFixed(2)),
          rank: value.rank,
        };
      });
      await ctx.services.academicSnapshot.create({
        classroomId: input.classroomId,
        termId: input.termId,
        reportcards: d,
      });
      return results;
    }),
  getAnnualReport: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.string().min(1),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.services.annual.getAnnualReport({
        classroomId: input.classroomId,
        termId: input.termId,
      });
    }),
} satisfies TRPCRouterRecord;
