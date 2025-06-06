import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const studentAccountRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.studentAccount.findMany({
      orderBy: {
        student: {
          lastName: "asc",
        },
      },
      include: {
        student: true,
      },
    });
  }),
  getByStudentId: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.studentAccount.findFirst({
        where: {
          studentId: input,
        },
      });
    }),
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.studentAccount.findUnique({
      where: {
        id: input,
      },
    });
  }),
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
        },
        where: {
          dueDate: {
            lt: new Date(),
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
          status: "VALIDATED",
          account: {
            studentId: input.studentId,
          },
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
          id: fee.classroom.id, // This is not an mistake, we are using the classroom id as the transaction
          reference: `${fee.id}`,
          classroom: fee.classroom.name,
          transactionRef:
            `${fee.description?.substring(5)}${fee.id}`.toUpperCase(),
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
            )?.name ?? "",
          transactionRef: (transaction.transactionRef ?? "").toUpperCase(),
          description: transaction.description ?? "",
          type: transaction.transactionType ?? "CREDIT",
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
