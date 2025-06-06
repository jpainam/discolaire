import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

const createUpdateBook = z.object({
  title: z.string(),
  description: z.string().optional(),
  isbn: z.string().optional(),
  available: z.coerce.number(),
  categoryId: z.string().min(1),
  author: z.string().optional().default(""),
});
export const bookRouter = {
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.book.findUnique({
      where: {
        id: input,
      },
      include: {
        category: true,
      },
    });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.book.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        category: true,
      },
    });
  }),
  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.bookCategory.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
  updateCategory: protectedProcedure
    .input(z.object({ id: z.string().min(1), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.bookCategory.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  deleteCategory: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.bookCategory.delete({
        where: {
          id: input,
        },
      });
    }),
  categories: protectedProcedure.query(({ ctx }) => {
    return ctx.db.bookCategory.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  recentlyUsed: protectedProcedure.query(({ ctx }) => {
    return ctx.db.book.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        category: true,
        borrowedBooks: true,
      },
      orderBy: {
        lastBorrowed: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(createUpdateBook)
    .mutation(({ ctx, input }) => {
      return ctx.db.book.create({
        data: {
          author: input.author,
          categoryId: input.categoryId,
          title: input.title,
          isbn: input.isbn,
          available: input.available,
          description: input.description,
          schoolId: ctx.schoolId,
        },
      });
    }),
  update: protectedProcedure
    .input(createUpdateBook.extend({ id: z.coerce.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.book.update({
        where: {
          id: input.id,
        },
        data: { ...input },
      });
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.book.delete({ where: { id: input } });
    }),
} satisfies TRPCRouterRecord;
