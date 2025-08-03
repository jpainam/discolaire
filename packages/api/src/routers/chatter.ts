import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const chatterRouter = {
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
        termId: z.string().min(1),
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
        termId: z.string().optional(),
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

      return ctx.db.chatter.findMany({
        include: {
          term: true,
        },
        where: {
          studentId: input.studentId,
          termId: {
            in: termIds,
          },
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
      return ctx.db.chatter.findMany({
        orderBy: {
          date: "desc",
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
        value: z.coerce.number(),
        studentId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chatter.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
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
        termId: z.string().min(1),
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
} satisfies TRPCRouterRecord;
