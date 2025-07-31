import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";
import { generateStringColor } from "../utils";

export const programRouter = {
  categories: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.programCategory.findMany({
      where: {
        schoolYearId: ctx.schoolYearId,
      },
      orderBy: {
        title: "asc",
      },
    });
  }),
  deleteCategory: protectedProcedure
    .input(z.union([z.array(z.string()), z.string()]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.programCategory.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  createCategory: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.programCategory.create({
        data: {
          title: input.title,
          color: generateStringColor(),
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.programCategory.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          color: generateStringColor(),
        },
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.program.findMany({
      where: {
        subject: {
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      },
      include: {
        category: true,
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.program.findUniqueOrThrow({
      include: {
        subject: true,
        objectives: true,

        category: true,
      },
      where: {
        id: input,
      },
    });
  }),
  bySubject: protectedProcedure
    .input(z.object({ subjectId: z.coerce.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.program.findMany({
        where: {
          subjectId: input.subjectId,
        },
        include: {
          category: true,
          objectives: {
            include: {
              session: true,
              program: true,
            },
          },
        },
      });
    }),

  byClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.program.findMany({
        where: {
          subject: {
            classroomId: input.classroomId,
          },
        },
        include: {
          category: true,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.string()), z.string()]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.program.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        requiredSessionCount: z.number().positive().default(1),
        subjectId: z.coerce.number(),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.program.create({
        data: {
          title: input.title,
          description: input.description,
          requiredSessionCount: input.requiredSessionCount,
          subjectId: input.subjectId,
          categoryId: input.categoryId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        requiredSessionCount: z.number().positive().default(1),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.program.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          requiredSessionCount: input.requiredSessionCount,
          categoryId: input.categoryId,
        },
      });
    }),

  changeCategory: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        categoryId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.program.update({
        where: {
          id: input.id,
        },
        data: {
          categoryId: input.categoryId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
