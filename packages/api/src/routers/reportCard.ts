import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { getAnnualReport } from "../services/annual-service";
import { getSequenceGrades } from "../services/sequence-service";
import { getTrimestreGrades } from "../services/trimestre-service";
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
    .query(({ input }) => {
      return getSequenceGrades(input.classroomId, input.termId);
    }),
  getTrimestre: protectedProcedure
    .input(
      z.object({
        trimestreId: z.enum(["trim1", "trim2", "trim3"]),
        classroomId: z.string().min(1),
      }),
    )
    .query(({ input, ctx }) => {
      return getTrimestreGrades(
        input.classroomId,
        input.trimestreId,
        ctx.schoolId,
        ctx.schoolYearId,
      );
    }),
  getAnnualReport: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
      }),
    )
    .query(({ input }) => {
      return getAnnualReport({ classroomId: input.classroomId });
    }),
} satisfies TRPCRouterRecord;
