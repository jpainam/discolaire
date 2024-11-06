import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { reportCardService } from "../services/report-card-service";
import { studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportCardRouter = createTRPCRouter({
  getClassroom: protectedProcedure
    .input(
      z.object({ termId: z.coerce.number(), classroomId: z.string().min(1) }),
    )
    .query(({ input }) => {
      return reportCardService.getClassroom(input.classroomId, input.termId);
    }),
  getStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.coerce.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const classroom = await studentService.getClassroom(
        input.studentId,
        ctx.schoolYearId,
      );
      if (!classroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student is not registered in any classroom",
        });
      }
      return reportCardService.getStudent(
        classroom.id,
        input.studentId,
        input.termId,
      );
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
  getSummary: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.coerce.number(),
      }),
    )
    .query(({}) => {
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
