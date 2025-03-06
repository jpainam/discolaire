import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateBook = z.object({
  title: z.string(),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  author: z.string().optional().default(""),
});
export const bookRouter = createTRPCRouter({
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
  lastBorrowed: protectedProcedure.query(({ ctx }) => {
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
});
