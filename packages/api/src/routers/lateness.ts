import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const latenessRouter = createTRPCRouter({
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.lateness.findUniqueOrThrow({
      include: {
        student: true,
        justification: true,
      },
      where: {
        id: input,
      },
    });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.lateness.findMany({
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
  justify: protectedProcedure
    .input(
      z.object({
        latenessId: z.coerce.number(),
        reason: z.string().min(1),
        comment: z.string().optional(),
        duration: z.coerce.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.latenessJustification.create({
        data: {
          reason: input.reason,
          latenessId: input.latenessId,
          createdById: ctx.session.user.id,
          duration: input.duration,
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
      const lateness = await ctx.db.lateness.findMany({
        include: {
          justification: true,
        },
        where: {
          studentId: input.studentId,
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
      const duration = lateness.reduce((acc, curr) => acc + curr.duration, 0);

      const justifications = lateness.filter((l) => l.justification);
      const justificationDuration = justifications.reduce(
        (acc, curr) => acc + (curr.justification?.duration ?? 0),
        0,
      );
      return {
        value: duration,
        total: lateness.length,
        justified: justificationDuration,
      };
    }),
  byClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.coerce.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.lateness.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          justification: true,
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
  createClassroom: protectedProcedure
    .input(
      z.object({
        termId: z.coerce.number(),
        classroomId: z.string().min(1),
        students: z.array(
          z.object({
            id: z.string().min(1),
            late: z.string().optional(),
            justify: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const student of input.students) {
        if (!student.late) {
          continue;
        }
        // convert student.late and student.justify into duration

        const late = await ctx.db.lateness.create({
          data: {
            termId: input.termId,
            studentId: student.id,
            classroomId: input.classroomId,
            date: new Date(),
            createdById: ctx.session.user.id,
            duration: Number(student.late),
          },
        });
        if (student.justify)
          await ctx.db.latenessJustification.create({
            data: {
              latenessId: late.id,
              status: "approved",
              duration: Number(student.justify),
              approvedBy: ctx.session.user.id,
              createdById: ctx.session.user.id,
            },
          });
      }
    }),
  byStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.coerce.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.lateness.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          student: true,
          justification: true,
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
        duration: z.coerce.number(),
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
      return ctx.db.lateness.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
          classroomId: classroom.id,
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
        duration: z.coerce.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lateness.update({
        where: {
          id: input.id,
        },
        data: {
          termId: input.termId,
          duration: input.duration,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.lateness.delete({
        where: {
          id: input,
        },
      });
    }),
  studentJustifications: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.lateness.findMany({
        where: {
          studentId: input.studentId,
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
        include: {
          justification: true,
          term: true,
        },
      });
    }),
  classroomJustifications: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.lateness.findMany({
        where: {
          classroomId: input.classroomId,
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
        include: {
          justification: true,
          term: true,
        },
      });
    }),
});
