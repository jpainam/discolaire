import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const absenceRouter = {
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.absence.findUniqueOrThrow({
      include: {
        student: true,
      },
      where: {
        id: input,
      },
    });
  }),
  all: protectedProcedure
    .input(
      z
        .object({
          from: z.coerce.date().optional(),
          to: z.coerce.date().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.absence.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          student: true,
        },
        where: {
          ...(input?.from && { date: { gte: input.from } }),
          ...(input?.to && { date: { lte: input.to } }),
          term: {
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
      const absences = await ctx.db.absence.findMany({
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
        total: absences.reduce((acc, curr) => acc + curr.value, 0),
        value: absences.reduce((acc, curr) => acc + curr.value, 0),
        justified: absences.reduce(
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
      return ctx.db.absence.findMany({
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
        },
      });
    }),
  byStudent: protectedProcedure
    .input(
      z.object({ studentId: z.string().min(1), termId: z.number().optional() }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.absence.findMany({
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
  deleteJustification: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.absence.update({
        data: {
          justified: null,
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
        students: z.array(
          z.object({
            id: z.string().min(1),
            absence: z.coerce.number().optional(),
            justify: z.coerce.number().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const absences = [];
      for (const student of input.students) {
        if (!student.absence) {
          continue;
        }
        const absence = await ctx.db.absence.create({
          data: {
            termId: input.termId,
            studentId: student.id,
            date: new Date(),
            createdById: ctx.session.user.id,
            value: student.absence,
            justified: student.justify ?? 0,
          },
        });
        absences.push(absence);
      }
      return absences;
    }),
  create: protectedProcedure
    .input(
      z.object({
        termId: z.coerce.number(),
        date: z.coerce.date().default(() => new Date()),
        value: z.coerce.number(),
        justify: z.coerce.number().optional(),
        studentId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.absence.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
          date: input.date,
          createdById: ctx.session.user.id,
          value: input.value,
          justified: input.justify ?? 0,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        termId: z.coerce.number(),
        value: z.coerce.number(),
        justify: z.coerce.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.absence.update({
        where: {
          id: input.id,
        },
        data: {
          termId: input.termId,
          value: input.value,
          justified: input.justify,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.absence.delete({
        where: {
          id: input,
        },
      });
    }),

  createPreventAbsence: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to: z.coerce.date(),
        reason: z.string().min(1),
        studentId: z.string().min(1),
        attachments: z.array(z.string()).optional(),
        comment: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.preventedAbsence.create({
        data: {
          from: input.from,
          createdById: ctx.session.user.id,
          to: input.to,
          studentId: input.studentId,
          reason: input.reason,
          attachments: input.attachments,
          comment: input.comment,
        },
      });
    }),
} satisfies TRPCRouterRecord;
