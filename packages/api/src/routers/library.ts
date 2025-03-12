import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const libraryRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    const books = await ctx.db.book.findMany({
      include: {
        borrowedBooks: true,
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
    const borrowed = books.reduce(
      (acc, book) => acc + book.borrowedBooks.length,
      0,
    );
    const activUsers = new Set(
      books
        .map((book) =>
          book.borrowedBooks.map((borrowedBook) => borrowedBook.userId),
        )
        .flat(),
    );
    const overdueBooks = books.reduce(
      (acc, book) =>
        acc +
        book.borrowedBooks.filter((borrowedBook) => {
          return borrowedBook.returned && borrowedBook.returned < new Date();
        }).length,
      0,
    );
    return {
      book: books.length,
      borrowed: borrowed,
      activeUser: activUsers.size,
      overdueBook: overdueBooks,
    };
  }),
  createBorrow: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        bookId: z.coerce.number().positive(),
        borrowed: z.date().default(() => new Date()),
        returned: z.date().nullable(),
        expected: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.borrowedBook.create({
        data: {
          user: {
            connect: {
              id: input.userId,
            },
          },
          book: {
            connect: {
              id: input.bookId,
            },
          },
          borrowed: input.borrowed,
          returned: input.returned,
          expected: input.expected,
        },
      });
    }),
  updateBorrow: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        userId: z.string().min(1),
        bookId: z.coerce.number().positive(),
        borrowed: z.date().default(() => new Date()),
        returned: z.date().nullable(),
        expected: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.borrowedBook.update({
        where: {
          id: input.id,
        },
        data: {
          user: {
            connect: {
              id: input.userId,
            },
          },
          book: {
            connect: {
              id: input.bookId,
            },
          },
          borrowed: input.borrowed,
          returned: input.returned,
          expected: input.expected,
        },
      });
    }),
  deleteBorrow: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.borrowedBook.delete({
        where: {
          id: input,
        },
      });
    }),
  borrowBooks: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.borrowedBook.findMany({
        take: input.limit,
        include: {
          book: true,
          user: true,
        },
        where: {
          book: {
            schoolId: ctx.schoolId,
          },
          user: {
            schoolId: ctx.schoolId,
          },
        },
      });
    }),
});
