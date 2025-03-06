import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateBook = z.object({
  title: z.string(),
  description: z.string().optional(),
  categoryId: z.number(),
  author: z.string().optional().default(""),
});
export const bookRouter = createTRPCRouter({
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
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.book.delete({ where: { id: input.id } });
    }),
});
