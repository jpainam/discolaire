import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { TransactionStatus, TransactionType } from "@repo/db/enums";

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
  syncOldFees: protectedProcedure.mutation(async ({ ctx }) => {
    const journals = await ctx.db.accountingJournal.findMany({
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
    const tdJournal = journals.find(
      (j) => j.name.toLowerCase().trim() === "td",
    );
    const feeJournal = journals.find(
      (j) => j.name.toLowerCase().trim() != "td",
    );

    if (feeJournal) {
      console.log("Updating fees with journal ID:", feeJournal.id);
      await ctx.db.transaction.updateMany({
        data: {
          journalId: feeJournal.id,
        },
        where: {
          schoolYearId: ctx.schoolYearId,
        },
      });
      await ctx.db.fee.updateMany({
        data: {
          journalId: feeJournal.id,
        },
        where: {
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
    }
    if (tdJournal) {
      console.log("Updating fees with journal ID:", tdJournal.id);
      await ctx.db.fee.updateMany({
        data: {
          journalId: tdJournal.id,
        },
        where: {
          code: "FRAI",
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
    }
    return tdJournal;
  }),
  insertTDTransactions: protectedProcedure.mutation(async ({ ctx }) => {
    const schoolYear = await ctx.db.schoolYear.findUniqueOrThrow({
      where: {
        id: ctx.schoolYearId,
      },
    });
    const fees = await ctx.db.fee.findMany({
      include: {
        journal: true,
      },
      where: {
        classroom: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
        journal: {
          name: { contains: "%TD%", mode: "insensitive" },
        },
      },
    });
    const journalIds = fees
      .map((fee) => fee.journalId)
      .filter((f) => f !== null);
    await ctx.db.transaction.deleteMany({
      where: {
        journalId: {
          in: journalIds,
        },
        transactionType: TransactionType.CREDIT,
        schoolYearId: ctx.schoolYearId,
      },
    });
    for (const fee of fees) {
      const enrollments = await ctx.db.enrollment.findMany({
        where: {
          classroomId: fee.classroomId,
          schoolYearId: ctx.schoolYearId,
        },
      });
      const data = enrollments.map((enr) => {
        const currentDate = Date.now();
        return {
          transactionRef:
            `${fee.journal?.name ?? "TD"}-${enr.studentId.substring(0, 3)}${currentDate}`.toUpperCase(),
          amount: fee.amount,
          description: `${fee.description} - Automatique`,
          studentId: enr.studentId,
          transactionType: TransactionType.CREDIT,
          status: TransactionStatus.VALIDATED,
          receivedById: ctx.session.user.id,
          isPrinted: true,
          printedById: ctx.session.user.id,
          method: "CASH",
          journalId: fee.journalId,
          createdById: ctx.session.user.id,
          schoolYearId: ctx.schoolYearId,
          createdAt: schoolYear.startDate,
        };
      });
      await ctx.db.transaction.createMany({
        data,
      });
    }
    return fees.length;
  }),

  deplacer: protectedProcedure.mutation(async ({ ctx }) => {
    const required = await ctx.db.requiredFeeTransaction.findMany({
      include: {
        fee: {
          include: {
            journal: true,
          },
        },
      },
      where: {
        fee: {
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      },
    });
    console.log("Required transactions to move:", required.length);

    const data = required.map((enr) => {
      const currentDate = Date.now();
      return {
        transactionRef:
          `${enr.fee.journal?.name ?? "TD"}-${enr.studentId.substring(0, 3)}${currentDate}`.toUpperCase(),
        amount: enr.fee.amount,
        description: `${enr.fee.description}`,
        studentId: enr.studentId,
        transactionType: TransactionType.CREDIT,
        status: enr.status.toUpperCase() as TransactionStatus,
        receivedById: enr.createdById,
        isPrinted: true,
        printedById: enr.createdById,
        method: "CASH",
        journalId: enr.fee.journalId,
        createdById: enr.createdById,
        schoolYearId: ctx.schoolYearId,
        createdAt: enr.createdAt,
      };
    });
    const x = await ctx.db.transaction.createMany({
      data,
    });
    console.log("Inserted transactions:", x.count);
    const ids = required.map((r) => r.id);
    // await ctx.db.requiredFeeTransaction.deleteMany({
    //   where: {
    //     id: {
    //       in: ids,
    //     },
    //   },
    // });
    return ids.length;
  }),
} satisfies TRPCRouterRecord;
