import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const latenessRouter = {
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
      return ctx.db.lateness.findMany({
        orderBy: {
          date: "desc",
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
        termIds: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const termIds =
        input.termIds ??
        (await ctx.db.term
          .findMany({
            select: { id: true },
            where: {
              schoolId: ctx.schoolId,
              schoolYearId: ctx.schoolYearId,
            },
          })
          .then((terms) => terms.map((term) => term.id)));
      return ctx.db.lateness.findMany({
        include: {
          student: true,
          justifications: true,
        },
        where: {
          studentId: input.studentId,
          termId: {
            in: termIds,
          },
        },
      });
    }),
  byClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.string().optional(),
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
        termId: z.string().min(1),
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
        const lateness = await ctx.db.lateness.create({
          data: {
            termId: input.termId,
            studentId: student.id,
            date: input.date,

            createdById: ctx.session.user.id,
            duration: student.late,
          },
        });
        if (student.justify) {
          await ctx.db.latenessJustification.create({
            data: {
              latenessId: lateness.id,
              reason: "",
              value: student.justify.toString(),
              createdById: ctx.session.user.id,
            },
          });
        }
      }
      return true;
    }),
  byStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.string().optional(),
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
        termId: z.string().min(1),
        date: z.coerce.date().default(() => new Date()),
        duration: z.string().min(1),
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
        termId: z.string().min(1),
        duration: z.string().min(1),
        reason: z.string().optional().default(""),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.lateness.update({
        where: {
          id: input.id,
        },
        data: {
          termId: input.termId,
          duration: input.duration,
          reason: input.reason,
          updatedById: ctx.session.user.id,
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
} satisfies TRPCRouterRecord;
