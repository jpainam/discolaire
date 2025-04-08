import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const latenessRouter = createTRPCRouter({
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.lateness.findUniqueOrThrow({
      include: {
        student: true,
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
      return ctx.db.lateness.update({
        where: {
          id: input.latenessId,
        },
        data: {
          reason: input.reason,
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
          student: true,
        },
        where: {
          studentId: input.studentId,
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });

      return {
        value: lateness.reduce((acc, curr) => acc + curr.duration, 0),
        total: lateness.length,
        justified: lateness.reduce(
          (acc, curr) => acc + (curr.justified ?? 0),
          0,
        ),
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
          student: true,
        },
        where: {
          student: {
            enrollments: {
              some: {
                classroomId: input.classroomId,
              },
            },
          },
          ...(input.termId && { termId: input.termId }),
          term: {
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
        date: z.coerce.date().default(() => new Date()),
        students: z.array(
          z.object({
            id: z.string().min(1),
            late: z.string().optional(),
            justify: z.coerce.number().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const student of input.students) {
        if (!student.late) {
          continue;
        }
        return ctx.db.lateness.create({
          data: {
            termId: input.termId,
            studentId: student.id,
            date: input.date,
            justified: student.justify ?? 0,
            createdById: ctx.session.user.id,
            duration: Number(student.late),
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
        },
        where: {
          studentId: input.studentId,
          ...(input.termId && { termId: input.termId }),
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
        duration: z.coerce.number(),
        studentId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lateness.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
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
});
