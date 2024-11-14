import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const exclusionRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.exclusion.findMany({
      orderBy: {
        startDate: "desc",
      },
      where: {
        term: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      },
    });
  }),
  byStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.exclusion.findMany({
        orderBy: {
          startDate: "desc",
        },
        where: {
          studentId: input.studentId,
          ...(input.termId ? { termId: input.termId } : {}),
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        termId: z.coerce.number(),
        startDate: z.coerce.date().default(() => new Date()),
        endDate: z.coerce.date().default(() => new Date()),
        studentId: z.string().min(1),
        reason: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const classroom = await studentService.getClassroom(
        input.studentId,
        ctx.schoolYearId,
      );
      if (!classroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not registered in any classroom",
        });
      }
      return ctx.db.exclusion.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
          classroomId: classroom.id,
          reason: input.reason,
          startDate: input.startDate,
          endDate: input.endDate,
          createdById: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        termId: z.coerce.number(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.exclusion.update({
        where: {
          id: input.id,
        },
        data: {
          termId: input.termId,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.exclusion.delete({
        where: {
          id: input,
        },
      });
    }),
});
