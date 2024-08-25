import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportCardRouter = createTRPCRouter({
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
  getSummary: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.coerce.number(),
      }),
    )
    .query(() => {
      return [];
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
});
