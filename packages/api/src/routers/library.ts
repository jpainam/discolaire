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
});
