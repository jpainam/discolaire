import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";

import { protectedProcedure } from "../trpc";

const borrowerTypeSchema = z.enum(["student", "staff", "contact"]);

const borrowerInclude = {
  student: { select: { id: true, firstName: true, lastName: true } },
  staff: { select: { id: true, firstName: true, lastName: true } },
  contact: { select: { id: true, firstName: true, lastName: true } },
  createdBy: { select: { id: true, name: true } },
} as const;

function toBorrowerFields(borrowerType: string, borrowerId: string) {
  return {
    studentId: borrowerType === "student" ? borrowerId : null,
    staffId: borrowerType === "staff" ? borrowerId : null,
    contactId: borrowerType === "contact" ? borrowerId : null,
  };
}

export const libraryRouter = {
  count: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const books = await ctx.db.book.findMany({
      include: { loans: true },
      where: { schoolId: ctx.schoolId },
    });
    const activeLoans = books.flatMap((book) =>
      book.loans.filter((l) => l.returned === null),
    );
    const borrowed = activeLoans.length;
    const activeBorrowers = new Set(
      activeLoans.map(
        (l) => l.studentId ?? l.staffId ?? l.contactId,
      ),
    );
    const overdueBooks = activeLoans.filter(
      (l) => l.expected !== null && l.expected < now,
    ).length;
    return {
      book: books.length,
      borrowed,
      activeUser: activeBorrowers.size,
      overdueBook: overdueBooks,
    };
  }),

  loans: protectedProcedure
    .input(
      z.object({
        pageSize: z.number().int().min(1).max(200).optional().default(30),
        cursor: z.number().int().nullish(),
        search: z.string().optional().default(""),
        sorting: z
          .array(z.object({ id: z.string(), desc: z.boolean() }))
          .optional()
          .default([]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const search = input.search.trim();
      const where: Prisma.BookLoanWhereInput = {
        book: { schoolId: ctx.schoolId },
        ...(search
          ? {
              OR: [
                { book: { title: { contains: search, mode: "insensitive" } } },
                {
                  book: { author: { contains: search, mode: "insensitive" } },
                },
                {
                  student: {
                    OR: [
                      {
                        firstName: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        lastName: { contains: search, mode: "insensitive" },
                      },
                    ],
                  },
                },
                {
                  staff: {
                    OR: [
                      {
                        firstName: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        lastName: { contains: search, mode: "insensitive" },
                      },
                    ],
                  },
                },
                {
                  contact: {
                    OR: [
                      {
                        firstName: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        lastName: { contains: search, mode: "insensitive" },
                      },
                    ],
                  },
                },
              ],
            }
          : {}),
      };

      const sortableFields = new Set(["borrowed", "expected", "returned"]);
      const orderBy = input.sorting
        .filter((s) => sortableFields.has(s.id))
        .map((s) => ({ [s.id]: s.desc ? "desc" : "asc" }));
      const resolvedOrderBy =
        orderBy.length > 0
          ? [...orderBy, { id: "desc" as const }]
          : [{ borrowed: "desc" as const }, { id: "desc" as const }];

      const take = input.pageSize + 1;
      const [rowCount, data] = await ctx.db.$transaction([
        ctx.db.bookLoan.count({ where }),
        ctx.db.bookLoan.findMany({
          where,
          include: { book: true, ...borrowerInclude },
          orderBy: resolvedOrderBy,
          take,
          ...(input.cursor
            ? { cursor: { id: input.cursor }, skip: 1 }
            : {}),
        }),
      ]);

      const hasNextPage = data.length > input.pageSize;
      const items = hasNextPage ? data.slice(0, -1) : data;
      const nextCursor = hasNextPage ? items[items.length - 1]?.id : undefined;
      return { data: items, rowCount, nextCursor };
    }),

  createLoan: protectedProcedure
    .input(
      z.object({
        borrowerType: borrowerTypeSchema,
        borrowerId: z.string().min(1),
        bookId: z.coerce.number().positive(),
        borrowed: z.date().default(() => new Date()),
        returned: z.date().nullable(),
        expected: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [loan] = await ctx.db.$transaction([
        ctx.db.bookLoan.create({
          data: {
            ...toBorrowerFields(input.borrowerType, input.borrowerId),
            createdById: ctx.session.user.id,
            bookId: input.bookId,
            borrowed: input.borrowed,
            returned: input.returned,
            expected: input.expected,
          },
        }),
        ctx.db.book.update({
          where: { id: input.bookId },
          data: { lastBorrowed: input.borrowed },
        }),
      ]);
      return loan;
    }),

  updateLoan: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        borrowerType: borrowerTypeSchema,
        borrowerId: z.string().min(1),
        bookId: z.coerce.number().positive(),
        borrowed: z.date().default(() => new Date()),
        returned: z.date().nullable(),
        expected: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookLoan.update({
        where: { id: input.id },
        data: {
          ...toBorrowerFields(input.borrowerType, input.borrowerId),
          bookId: input.bookId,
          borrowed: input.borrowed,
          returned: input.returned,
          expected: input.expected,
        },
      });
    }),

  deleteLoan: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookLoan.delete({ where: { id: input } });
    }),

  updateLoanStatus: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        returned: z.boolean().default(false),
        expected: z.date().nullable().default(null),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookLoan.update({
        data: {
          returned: input.returned ? new Date() : null,
          expected: input.expected,
        },
        where: { id: input.id },
      });
    }),

  reservations: protectedProcedure
    .input(
      z.object({
        pageSize: z.number().int().min(1).max(200).optional().default(30),
        cursor: z.number().int().nullish(),
        search: z.string().optional().default(""),
        sorting: z
          .array(z.object({ id: z.string(), desc: z.boolean() }))
          .optional()
          .default([]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const search = input.search.trim();
      const where: Prisma.BookReservationWhereInput = {
        schoolId: ctx.schoolId,
        ...(search
          ? {
              OR: [
                { book: { title: { contains: search, mode: "insensitive" } } },
                {
                  book: { author: { contains: search, mode: "insensitive" } },
                },
                {
                  student: {
                    OR: [
                      {
                        firstName: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        lastName: { contains: search, mode: "insensitive" },
                      },
                    ],
                  },
                },
                {
                  staff: {
                    OR: [
                      {
                        firstName: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        lastName: { contains: search, mode: "insensitive" },
                      },
                    ],
                  },
                },
                {
                  contact: {
                    OR: [
                      {
                        firstName: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        lastName: { contains: search, mode: "insensitive" },
                      },
                    ],
                  },
                },
              ],
            }
          : {}),
      };

      const sortableFields = new Set(["reservedAt", "expiresAt", "status"]);
      const orderBy = input.sorting
        .filter((s) => sortableFields.has(s.id))
        .map((s) => ({ [s.id]: s.desc ? "desc" : "asc" }));
      const resolvedOrderBy =
        orderBy.length > 0
          ? [...orderBy, { id: "desc" as const }]
          : [{ reservedAt: "desc" as const }, { id: "desc" as const }];

      const take = input.pageSize + 1;
      const [rowCount, data] = await ctx.db.$transaction([
        ctx.db.bookReservation.count({ where }),
        ctx.db.bookReservation.findMany({
          where,
          include: { book: true, ...borrowerInclude },
          orderBy: resolvedOrderBy,
          take,
          ...(input.cursor
            ? { cursor: { id: input.cursor }, skip: 1 }
            : {}),
        }),
      ]);

      const hasNextPage = data.length > input.pageSize;
      const items = hasNextPage ? data.slice(0, -1) : data;
      const nextCursor = hasNextPage ? items[items.length - 1]?.id : undefined;
      return { data: items, rowCount, nextCursor };
    }),

  createReservation: protectedProcedure
    .input(
      z.object({
        bookId: z.coerce.number().positive(),
        borrowerType: borrowerTypeSchema,
        borrowerId: z.string().min(1),
        expiresAt: z.date().nullable(),
        status: z
          .enum(["PENDING", "CONFIRMED", "CANCELLED", "FULFILLED"])
          .default("PENDING"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookReservation.create({
        data: {
          bookId: input.bookId,
          ...toBorrowerFields(input.borrowerType, input.borrowerId),
          createdById: ctx.session.user.id,
          expiresAt: input.expiresAt,
          status: input.status,
          schoolId: ctx.schoolId,
        },
      });
    }),

  deleteReservation: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookReservation.delete({ where: { id: input } });
    }),

  updateReservationStatus: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "FULFILLED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookReservation.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
} satisfies TRPCRouterRecord;
