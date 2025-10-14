import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { getPrograms } from "../services/subject-service";
import { protectedProcedure } from "../trpc";

export const subjectRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.subject.findMany({
      include: {
        course: true,
      },
      where: {
        classroom: {
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
        },
      },
      orderBy: {
        course: {
          name: "asc",
        },
      },
    });
  }),
  get: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ input, ctx }) => {
      const subject = await ctx.db.subject.findUnique({
        where: {
          id: input,
        },
        include: {
          course: true,
          subjectGroup: true,
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      if (!subject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subject not found",
        });
      }
      return subject;
    }),

  create: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        courseId: z.string().min(1),
        teacherId: z.string().min(1),
        subjectGroupId: z.number(),
        order: z.coerce.number().default(1),
        coefficient: z.coerce.number().default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subject.create({
        data: input,
      });
    }),

  updateProgram: protectedProcedure
    .input(z.object({ id: z.coerce.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subject.update({
        where: {
          id: input.id,
        },
        data: {
          program: input.content,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        classroomId: z.string().min(1),
        courseId: z.string().min(1),
        teacherId: z.string().min(1),
        subjectGroupId: z.number(),
        order: z.number(),
        coefficient: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.subject.update({
        where: {
          id: id,
        },
        data: data,
      });
    }),

  delete: protectedProcedure
    .input(z.union([z.number(), z.array(z.number())]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subject.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),

  programs: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().optional(),
        staffId: z.string().optional(),
        categoryId: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.subject.findMany({
        where: {
          classroom: {
            schoolYearId: ctx.schoolYearId,
            schoolId: ctx.schoolId,
            ...(input.classroomId ? { id: input.classroomId } : {}),
          },
          ...(input.staffId ? { teacherId: input.staffId } : {}),
          ...(input.categoryId
            ? {
                programs: {
                  some: { categoryId: input.categoryId },
                },
              }
            : {}),
        },
        include: {
          classroom: {
            include: {
              level: true,
            },
          },
          course: true,
          teacher: true,
          programs: {
            include: {
              teachingSessions: {
                include: {
                  session: true,
                },
              },
            },
          },
        },
      });
    }),
  getCoverage: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.programCategory.findMany({
        where: {
          schoolYearId: ctx.schoolYearId,
          programs: {
            some: {
              subjectId: input,
            },
          },
        },
        include: {
          programs: {
            include: {
              teachingSessions: {
                include: {
                  session: true,
                },
              },
            },
          },
        },
      });
    }),

  getPrograms: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().optional(),
        staffId: z.string().optional(),
        categoryId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getPrograms({
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
        classroomId: input.classroomId,
        categoryId: input.categoryId,
        staffId: input.staffId,
      });
    }),
} satisfies TRPCRouterRecord;
