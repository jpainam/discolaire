import { z } from "zod";

import { getGrades } from "../services/reportcard-service";
import { getSequenceGrades } from "../services/sequence-service";
import { getTrimestreGrades } from "../services/trimestre-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportCardRouter = createTRPCRouter({
  getGrades: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.coerce.number(),
      }),
    )
    .query(({ input }) => {
      return getGrades(input.classroomId, input.termId);
    }),

  getRemarks: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.coerce.number(),
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
        termId: z.coerce.number(),
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
        termId: z.coerce.number(),
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
        termId: z.coerce.number(),
      }),
    )
    .query(({ input }) => {
      return getSequenceGrades(input.classroomId, input.termId);
    }),
  getTrimestre: protectedProcedure
    .input(
      z.object({
        trimestreId: z.string().min(1),
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
});
