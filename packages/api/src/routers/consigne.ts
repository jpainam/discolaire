import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const consigneRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.consigne.findMany({
      orderBy: {
        date: "desc",
      },
      where: {
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
        date: z.coerce.date().default(() => new Date()),
        studentId: z.string().min(1),
        task: z.string().min(1),
        duration: z.number().default(1),
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
      return ctx.db.consigne.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
          classroomId: classroom.id,
          task: input.task,
          date: input.date,
          createdById: ctx.session.user.id,
          duration: input.duration,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        termId: z.coerce.number(),
        date: z.coerce.date(),
        task: z.string().min(1),
        duration: z.number().default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.consigne.update({
        where: {
          id: input.id,
        },
        data: {
          termId: input.termId,
          date: input.date,
          task: input.task,
          duration: input.duration,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.consigne.delete({
        where: {
          id: input,
        },
      });
    }),
});
