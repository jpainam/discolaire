import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const accountingJournal = {
  get: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.db.accountingJournal.findUniqueOrThrow({
      where: {
        id: input,
      },
    });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.accountingJournal.findMany({
      where: {
        schoolYearId: ctx.schoolYearId,
        schoolId: ctx.schoolId,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingJournal.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        id: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingJournal.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingJournal.create({
        data: {
          name: input.name,
          description: input.description,
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
        },
      });
    }),
  stats: protectedProcedure.query(async ({ ctx }) => {
    const journalsWithCounts = await ctx.db.accountingJournal.findMany({
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
      include: {
        _count: {
          select: {
            fees: true,
            transactions: true,
          },
        },
      },
    });
    return journalsWithCounts.map((journal) => {
      return {
        id: journal.id,
        name: journal.name,
        description: journal.description,
        createdAt: journal.createdAt,
        feesCount: journal._count.fees,
        schoolYearId: journal.schoolYearId,
        transactionsCount: journal._count.transactions,
      };
    });
  }),
} satisfies TRPCRouterRecord;
