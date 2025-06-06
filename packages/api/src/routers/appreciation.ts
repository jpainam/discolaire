import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

const createUpdateCategorySchema = z.object({
  name: z.string(),
  isActive: z.boolean().default(true),
});
const createUpdateSchema = z.object({
  content: z.string(),
  categoryId: z.number(),
});
export const appreciationRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.appreciation.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });
  }),
  get: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.appreciation.findUnique({
      include: {
        category: true,
      },
      where: {
        id: input,
      },
    });
  }),
  byCategory: protectedProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.appreciation.findMany({
        where: {
          categoryId: input.categoryId,
        },
      });
    }),
  categories: protectedProcedure.query(({ ctx }) => {
    return ctx.db.appreciationCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  createCategory: protectedProcedure
    .input(createUpdateCategorySchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.appreciationCategory.create({
        data: input,
      });
    }),
  updateCategory: protectedProcedure
    .input(createUpdateCategorySchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.appreciationCategory.update({
        where: { id: input.id },
        data: input,
      });
    }),
  deleteCategory: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.appreciationCategory.delete({
        where: {
          id: input,
        },
      });
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.appreciation.create({
        data: {
          categoryId: input.categoryId,
          content: input.content,
        },
      });
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.appreciation.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
          categoryId: input.categoryId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.number()), z.number()]))
    .mutation(({ ctx, input }) => {
      return ctx.db.appreciation.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
