import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { TransactionStatus } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const studentAccountRouter = {
  getStatements: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const fees = await ctx.db.fee.findMany({
        orderBy: {
          dueDate: "asc",
        },
        include: {
          classroom: true,
          journal: true,
        },
        where: {
          dueDate: {
            lte: new Date(),
          },
          classroom: {
            enrollments: {
              some: {
                studentId: input.studentId,
              },
            },
          },
        },
      });
      const classrooms = await ctx.db.classroom.findMany({
        where: {
          enrollments: {
            some: {
              studentId: input.studentId,
            },
          },
        },
      });
      const transactions = await ctx.db.transaction.findMany({
        where: {
          deletedAt: null,
          status: TransactionStatus.VALIDATED,
          studentId: input.studentId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      const items: {
        transactionDate: Date;
        transactionRef: string;
        description: string;
        reference: string;
        classroom: string;
        type: string;
        id: string;
        operation: "fee" | "transaction";
        amount: number;
      }[] = [];
      for (const fee of fees) {
        items.push({
          transactionDate: fee.dueDate,
          id: fee.classroom.id, // This is not an mistake, we are using the classroom id as the id
          reference: `${fee.id}`,
          classroom: fee.classroom.reportName,
          transactionRef:
            `${fee.description?.substring(8)}${fee.id}`.toUpperCase(),
          description: fee.description ?? "",
          type: "DEBIT",
          operation: "fee",
          amount: fee.amount,
        });
      }
      for (const transaction of transactions) {
        items.push({
          transactionDate: transaction.createdAt,
          id: `${transaction.id}`,
          reference: transaction.method,
          classroom:
            classrooms.find(
              (cl) => cl.schoolYearId === transaction.schoolYearId,
            )?.reportName ?? "",
          transactionRef: (transaction.transactionRef ?? "").toUpperCase(),
          description: transaction.description ?? "",
          type: transaction.transactionType,
          amount: transaction.amount,
          operation: "transaction",
        });
      }
      const sortedItems = items.sort((a, b) => {
        return a.transactionDate.getTime() - b.transactionDate.getTime();
      });
      return sortedItems;
    }),
} satisfies TRPCRouterRecord;
