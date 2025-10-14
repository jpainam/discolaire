import type { TRPCRouterRecord } from "@trpc/server";
import { subDays } from "date-fns";
import { z } from "zod/v4";

import { TransactionType } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const fundRouter = {
  all: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().optional().default(subDays(new Date(), 30)),
        to: z.coerce.date().optional().default(new Date()),
        journalId: z.string().optional(),
        limit: z.number().optional().default(1000),
      }),
    )
    .query(async ({ input, ctx }) => {
      const fees = await ctx.db.fee.findMany({
        include: {
          classroom: true,
        },
        orderBy: {
          dueDate: "desc",
        },
        take: input.limit,
        where: {
          ...(input.journalId ? { journalId: input.journalId } : {}),
          classroom: {
            schoolYearId: ctx.schoolYearId,
            schoolId: ctx.schoolId,
          },
        },
      });
      const transactions = await ctx.db.transaction.findMany({
        include: {
          student: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        where: {
          deletedAt: null,
        },
      });
      const data: {
        date: Date;
        description: string;
        amount: number;
        type: string;
      }[] = [];
      transactions.forEach((t) => {
        data.push({
          date: t.createdAt,
          description: `${t.student.lastName} ${t.student.firstName}/${t.description}`,
          amount: t.amount,
          type: t.transactionType == TransactionType.DEBIT ? "CREDIT" : "DEBIT",
        });
      });
      fees.forEach((f) => {
        data.push({
          date: f.dueDate,
          description: `${f.classroom.reportName}/${f.description}`,
          amount: f.amount,
          type: "DEBIT",
        });
      });
      return data.sort((a, b) => b.date.getTime() - a.date.getTime());
    }),
} satisfies TRPCRouterRecord;
