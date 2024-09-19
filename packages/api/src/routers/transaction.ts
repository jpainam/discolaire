import { TRPCError } from "@trpc/server";
import { subDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  amount: z.number(),
  studentId: z.string(),
  description: z.string().optional(),
  method: z.string().optional().default("CASH"),
  status: z.string().optional().default("PENDING"),
  transactionType: z.string().optional().default("CREDIT"),
  observation: z.string().optional(),
});

export const transactionRouter = createTRPCRouter({
  count: protectedProcedure.query(({ ctx }) => {
    return ctx.db.transaction.count({
      where: {
        schoolYearId: ctx.schoolYearId,
        deletedAt: null,
      },
    });
  }),

  all: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().optional().default(subDays(new Date(), 7)),
        to: z.coerce.date().optional().default(new Date()),
        status: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.transaction.findMany({
        include: {
          account: true,
          journal: true,
        },
        where: {
          AND: [
            { schoolYearId: ctx.schoolYearId },
            { deletedAt: null },
            {
              createdAt: {
                gte: input.from,
                lte: input.to,
              },
            },
            ...(input.status ? [{ status: { equals: input.status } }] : [{}]),
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        transactionId: z.number(),
        status: z.enum(["PENDING", "VALIDATED", "CANCELLED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.update({
        where: {
          id: input.transactionId,
        },
        data: {
          status: input.status,
        },
      });
    }),
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.transaction.findUnique({
      include: {
        journal: true,
        account: {
          include: {
            student: true,
          },
        },
      },
      where: {
        id: input,
      },
    });
  }),
  delete: protectedProcedure
    .input(
      z.object({
        ids: z.union([z.coerce.number(), z.array(z.coerce.number())]),
        observation: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.updateMany({
        where: {
          id: {
            in: Array.isArray(input.ids) ? input.ids : [input.ids],
          },
        },
        data: {
          deletedAt: new Date(),
          deletedBy: ctx.session.user.id,
          observation: input.observation,
        },
      });
    }),
  quotas: protectedProcedure.query(async ({ ctx }) => {
    const classrooms = await ctx.db.classroom.findMany({
      where: {
        schoolYearId: ctx.schoolYearId,
      },
      include: {
        section: true,
        cycle: true,
        enrollments: {
          select: {
            studentId: true,
          },
        },
        fees: {
          select: {
            amount: true,
          },
        },
      },
    });

    const totalFees = await ctx.db.fee.groupBy({
      by: ["classroomId"],
      _sum: {
        amount: true,
      },
      where: {
        classroom: {
          schoolYearId: ctx.schoolYearId,
        },
      },
    });
    const totalFeeMap: Record<string, number> = {};
    totalFees.forEach((item) => {
      totalFeeMap[item.classroomId] = item._sum.amount ?? 0;
    });

    const enrollmentIds = classrooms.flatMap((classroom) =>
      classroom.enrollments.map((enrollment) => enrollment.studentId),
    );

    const transactions = await ctx.db.transaction.findMany({
      where: {
        deletedAt: null,
        schoolYearId: ctx.schoolYearId,
        account: {
          studentId: {
            in: enrollmentIds,
          },
        },
      },
      select: {
        account: {
          select: {
            studentId: true,
          },
        },
        amount: true,
      },
    });

    const totalTransactionMap: Record<string, number> = {};
    transactions.forEach((transaction) => {
      const studentId = transaction.account.studentId;
      if (totalTransactionMap[studentId]) {
        totalTransactionMap[studentId] += transaction.amount;
      } else {
        totalTransactionMap[studentId] = transaction.amount;
      }
    });

    const finalResult = classrooms.map((classroom) => {
      const totalFee = totalFeeMap[classroom.id] ?? 0;
      const enrollmentsIds = classroom.enrollments.map(
        (enrollment) => enrollment.studentId,
      );

      const totalPaid = enrollmentsIds.reduce(
        (sum, studentId) => sum + (totalTransactionMap[studentId] ?? 0),
        0,
      );

      return {
        classroom: classroom.name,
        paid: totalPaid,
        revenue: totalFee * enrollmentsIds.length,
        remaining: Math.abs(totalFee * enrollmentsIds.length - totalPaid),
        section: classroom.section?.name ?? "",
        cycle: classroom.cycle?.name ?? "",
      };
    });
    return finalResult;
  }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const currentDate = Date.now();
      const transactionRef = `${input.transactionType.substring(0, 2)}000${currentDate}`;
      const account = await ctx.db.studentAccount.findFirst({
        where: {
          studentId: input.studentId,
        },
      });
      if (!account) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `account for ${input.studentId} not found`,
        });
      }
      const result = await ctx.db.transaction.create({
        data: {
          accountId: account.id,
          amount: Number(input.amount),
          transactionRef: transactionRef,
          transactionType: input.transactionType,
          schoolYearId: ctx.schoolYearId,
          description: input.description,
          receivedById: ctx.session.user.id,
        },
      });
      // TODO : send notification
      return result;
    }),
  trends: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.transaction.groupBy({
      where: {
        schoolYearId: ctx.schoolYearId,
        deletedAt: null,
      },
      by: ["createdAt"],
      _sum: {
        amount: true,
      },
    });
    const resultMap: Record<string, number> = {};
    const dateFormat = Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    result.forEach((item) => {
      const key = dateFormat.format(item.createdAt);
      resultMap[key] = (resultMap[key] ?? 0) + (item._sum.amount ?? 0);
    });
    return Object.keys(resultMap).map((item) => ({
      date: item,
      amount: resultMap[item],
    }));
  }),
  stats: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().optional().default(subDays(new Date(), 7)),
        to: z.coerce.date().optional().default(new Date()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const currentFees = await ctx.db.fee.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          classroom: {
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
      const totalCompleted = await ctx.db.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          schoolYearId: ctx.schoolYearId,
          deletedAt: null,
          status: "VALIDATED",
        },
      });
      const totalInProgress = await ctx.db.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: input.from,
            lte: input.to,
          },
          deletedAt: null,
          status: "PENDING",
        },
      });

      const totalDeleted = await ctx.db.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: input.from,
            lte: input.to,
          },
          deletedAt: {
            not: null,
          },
        },
      });
      return {
        totalFee: currentFees._sum.amount ?? 0,
        totalCompleted: totalCompleted._sum.amount ?? 0,
        totalInProgress: totalInProgress._sum.amount ?? 0,
        totalDeleted: totalDeleted._sum.amount ?? 0,
        increased: true,
        percentage: 4.4,
      };
    }),
});
