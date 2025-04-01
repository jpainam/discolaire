import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateCategorySchema = z.object({
  name: z.string(),
});
const createUpdateSchema = z.object({
  title: z.string(),
  description: z.string(),
  isActive: z.boolean().optional().default(true),
  categoryId: z.string(),
  subjectId: z.coerce.number(),
  classroomId: z.string(),
  attachments: z.array(z.string()).optional(),
  from: z.coerce.date(),
  termId: z.coerce.number(),
  to: z.coerce.date(),
  notify: z.boolean().optional().default(false),
  visibles: z.array(z.string()).optional(),
});
export const assignmentRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.assignment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        classroom: true,
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.assignment.findUniqueOrThrow({
      include: {
        classroom: true,
        term: true,
        category: true,
        subject: {
          include: {
            course: true,
            teacher: true,
          },
        },
      },
      where: {
        id: input,
      },
    });
  }),
  categories: protectedProcedure.query(({ ctx }) => {
    return ctx.db.assignmentCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  createCategory: protectedProcedure
    .input(createUpdateCategorySchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.assignmentCategory.create({
        data: input,
      });
    }),
  updateCategory: protectedProcedure
    .input(createUpdateCategorySchema.extend({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.assignmentCategory.update({
        where: { id: input.id },
        data: input,
      });
    }),
  deleteCategory: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db.assignmentCategory.delete({
        where: {
          id: input,
        },
      });
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.assignment.create({
        data: {
          createdById: ctx.session.user.id,
          ...input,
        },
      });
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.assignment.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.string()), z.string()]))
    .mutation(({ ctx, input }) => {
      return ctx.db.assignment.deleteMany({
        where: {
          subject: {
            classroom: {
              schoolId: ctx.schoolId,
            },
          },
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  getLatest: protectedProcedure
    .input(z.object({ pageSize: z.coerce.number().default(10) }))
    .query(({ ctx, input }) => {
      return ctx.db.assignment.findMany({
        include: {
          category: true,
          subject: {
            include: {
              teacher: true,
              course: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.pageSize,
      });
    }),
});
