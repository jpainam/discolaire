import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subjectRouter = createTRPCRouter({
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
});
