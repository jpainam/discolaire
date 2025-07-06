import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const exclusionRouter = {
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.exclusion.findUniqueOrThrow({
      where: {
        id: input,
      },
    });
  }),
  createClassroom: protectedProcedure
    .input(
      z.object({
        termId: z.string().min(1),
        students: z.array(
          z.object({
            id: z.string().min(1),
            from: z.coerce.date().nullish(),
            to: z.coerce.date().nullish(),
            reason: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const student of input.students) {
        if (!student.from || !student.to) {
          continue;
        }
        await ctx.db.exclusion.create({
          data: {
            termId: input.termId,
            studentId: student.id,
            startDate: student.from,
            endDate: student.to,
            reason: student.reason ?? "",
            createdById: ctx.session.user.id,
          },
        });
      }
      return true;
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
      return ctx.db.exclusion.findMany({
        orderBy: {
          startDate: "desc",
        },
        include: {
          student: true,
        },
        where: {
          ...(input?.from && { startDate: { gte: input.from } }),
          ...(input?.to && { endDate: { lte: input.to } }),
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
        termId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.exclusion.findMany({
        orderBy: {
          startDate: "desc",
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
  studentSummary: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const exclusion = await ctx.db.exclusion.findMany({
        where: {
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
          studentId: input.studentId,
        },
      });
      return {
        value: exclusion.length,
        total: exclusion.length,
        justified: 0,
      };
    }),
  byStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.string().optional(),
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
        termId: z.string().min(1),
        startDate: z.coerce.date().default(() => new Date()),
        endDate: z.coerce.date().default(() => new Date()),
        studentId: z.string().min(1),
        reason: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.exclusion.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
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
        termId: z.string().min(1),
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
} satisfies TRPCRouterRecord;
