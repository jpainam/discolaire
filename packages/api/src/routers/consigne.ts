import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const consigneRouter = {
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.consigne.findUniqueOrThrow({
      include: {
        student: true,
      },
      where: {
        id: input,
      },
    });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.consigne.findMany({
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
        termId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.consigne.findMany({
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
            where: {
              schoolId: ctx.schoolId,
              schoolYearId: ctx.schoolYearId,
            },
            select: {
              id: true,
            },
          })
          .then((terms) => terms.map((term) => term.id)));
      return ctx.db.consigne.findMany({
        include: {
          term: true,
        },
        where: {
          termId: {
            in: termIds,
          },
          studentId: input.studentId,
        },
      });
    }),
  byStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.consigne.findMany({
        orderBy: {
          date: "desc",
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
        date: z.coerce.date().default(() => new Date()),
        studentId: z.string().min(1),
        task: z.string().min(1),
        duration: z.number().default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.consigne.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
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
        termId: z.string().min(1),
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
} satisfies TRPCRouterRecord;
