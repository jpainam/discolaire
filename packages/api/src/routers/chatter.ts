import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatterRouter = createTRPCRouter({
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.chatter.findUniqueOrThrow({
      include: {
        student: true,
      },
      where: {
        id: input,
      },
    });
  }),
  createClassroom: protectedProcedure
    .input(
      z.object({
        termId: z.coerce.number(),
        classroomId: z.string().min(1),
        students: z.array(
          z.object({
            id: z.string().min(1),
            chatter: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const student of input.students) {
        if (!student.chatter) {
          continue;
        }
        await ctx.db.chatter.create({
          data: {
            termId: input.termId,
            studentId: student.id,
            classroomId: input.classroomId,
            date: new Date(),
            type: "periodically",
            createdById: ctx.session.user.id,
            value: Number(student.chatter),
          },
        });
      }
      return true;
    }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.chatter.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        student: true,
      },
      where: {
        term: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      },
    });
  }),
  byClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.coerce.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.chatter.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          student: true,
        },
        where: {
          classroomId: input.classroomId,
          term: {
            ...(input.termId && { id: input.termId }),
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
    }),
  studentSummary: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const chatters = await ctx.db.chatter.findMany({
        where: {
          studentId: input.studentId,
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
      return {
        value: chatters.reduce((acc, curr) => acc + curr.value, 0),
        total: chatters.length,
        justified: 0,
      };
    }),
  byStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.chatter.findMany({
        orderBy: {
          date: "desc",
        },
        where: {
          studentId: input.studentId,
          term: {
            ...(input.termId && { id: input.termId }),
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
        value: z.coerce.number(),
        studentId: z.string().min(1),
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
      return ctx.db.chatter.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
          classroomId: classroom.id,
          date: input.date,
          createdById: ctx.session.user.id,
          value: input.value,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        termId: z.coerce.number(),
        value: z.coerce.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chatter.update({
        where: {
          id: input.id,
        },
        data: {
          termId: input.termId,
          value: input.value,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chatter.delete({
        where: {
          id: input,
        },
      });
    }),
});
