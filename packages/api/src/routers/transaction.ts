import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { addDays, subDays, subMonths } from "date-fns";
import { z } from "zod";

import type { TransactionStatus, TransactionType } from "@repo/db/enums";

import { classroomService } from "../services/classroom-service";
import {
  getTransactionSummary,
  transactionService,
} from "../services/transaction-service";
import { protectedProcedure } from "../trpc";
import { notificationQueue } from "../utils";

const createSchema = z.object({
  amount: z.number(),
  studentId: z.string(),
  description: z.string().optional(),
  method: z.string().optional().default("CASH"),
  status: z
    .enum(["PENDING", "CANCELED", "VALIDATED"])
    .optional()
    .default("PENDING"),

  transactionType: z.enum(["CREDIT", "DEBIT", "DISCOUNT"]),
  observation: z.string().optional(),
  journalId: z.string().min(1),
});

export const transactionRouter = {
  count: protectedProcedure.query(({ ctx }) => {
    return ctx.db.transaction.count({
      where: {
        schoolYearId: ctx.schoolYearId,
        deletedAt: null,
      },
    });
  }),

  getDeleted: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().optional().default(subMonths(new Date(), 3)),
        to: z.coerce.date().optional().default(new Date()),
        status: z.string().optional(),
        classroom: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const status = input.status
        ? (input.status as TransactionStatus)
        : undefined;

      const students = input.classroom
        ? await classroomService.getStudents(input.classroom)
        : [];
      const studentIds: string[] = students.map((stud) => stud.id);
      return ctx.db.transaction.findMany({
        include: {
          student: true,
          deletedBy: true,
        },
        where: {
          AND: [
            { schoolYearId: ctx.schoolYearId },
            {
              deletedAt: {
                not: null,
              },
            },
            {
              createdAt: {
                gte: input.from,
                lte: input.to,
              },
            },
            ...(status ? [{ status: { equals: status } }] : [{}]),
            ...(input.classroom
              ? [
                  {
                    studentId: {
                      in: studentIds,
                    },
                  },
                ]
              : [{}]),
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  all: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().optional(),
        limit: z.number().optional().default(200),
        to: z.coerce.date().optional().default(new Date()),
        status: z.string().optional(),
        classroomId: z.string().optional(),
        journalId: z.string().optional(),
        transactionType: z.enum(["CREDIT", "DEBIT", "DISCOUNT"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const status = input.status
        ? (input.status as TransactionStatus)
        : undefined;

      return ctx.db.transaction.findMany({
        take: input.limit,
        include: {
          journal: true,
          createdBy: true,
          updatedBy2: true,
          receivedBy: true,
          deletedBy: true,
          student: {
            include: {
              user: true,
            },
          },
        },
        where: {
          schoolYearId: ctx.schoolYearId,
          AND: [
            { deletedAt: null },
            ...(input.transactionType
              ? [{ transactionType: { equals: input.transactionType } }]
              : [{}]),
            ...(input.journalId
              ? [{ journalId: { equals: input.journalId } }]
              : [{}]),
            ...(input.from
              ? [
                  {
                    createdAt: {
                      gte: input.from,
                      lt: addDays(input.to, 1),
                    },
                  },
                ]
              : [{}]),
            ...(status ? [{ status: { equals: status } }] : [{}]),
            ...(input.classroomId
              ? [
                  {
                    student: {
                      enrollments: {
                        some: {
                          classroomId: input.classroomId,
                        },
                      },
                    },
                  },
                ]
              : [{}]),
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
        transactionId: z.coerce.number().optional(),
        transactionIds: z.array(z.coerce.number()).optional(),
        status: z.enum(["PENDING", "VALIDATED", "CANCELED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.transactionId && !input.transactionIds) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "transactionId or transactionIds is required",
        });
      }
      if (input.transactionIds) {
        return ctx.db.transaction.updateMany({
          where: {
            id: {
              in: input.transactionIds,
            },
          },
          data: {
            status: input.status,
            updatedById: ctx.session.user.id,
          },
        });
      }
      return ctx.db.transaction.update({
        where: {
          id: input.transactionId,
        },
        data: {
          status: input.status,
          updatedById: ctx.session.user.id,
        },
      });
    }),
  get: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      const t = await ctx.db.transaction.findUnique({
        include: {
          journal: true,
          student: true,
          createdBy: true,
          updatedBy2: true,
          receivedBy: true,
          deletedBy: true,
          printedBy: true,
        },
        where: {
          id: input,
        },
      });
      if (!t) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Transaction with id ${input} not found`,
        });
      }
      return t;
    }),
  getReceiptInfo: protectedProcedure
    .input(z.coerce.number())
    .query(({ input }) => {
      return transactionService.getReceiptInfo(input);
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
          deletedById: ctx.session.user.id,
          updatedById: ctx.session.user.id,
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

        studentId: {
          in: enrollmentIds,
        },
      },
      select: {
        studentId: true,
        amount: true,
      },
    });

    const totalTransactionMap: Record<string, number> = {};
    transactions.forEach((transaction) => {
      const studentId = transaction.studentId;
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
        reportName: classroom.reportName,
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
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const currentDate = Date.now();
      const transactionRef = `${input.transactionType.substring(0, 2)}000${currentDate}`;

      const result = await ctx.db.transaction.create({
        data: {
          studentId: input.studentId,
          amount: Number(input.amount),
          transactionRef: transactionRef,
          transactionType: input.transactionType as TransactionType,
          schoolYearId: ctx.schoolYearId,
          description: input.description,
          createdById: ctx.session.user.id,
          receivedById: ctx.session.user.id,
          journalId: input.journalId,
          method: input.method,
          updatedById: ctx.session.user.id,
        },
      });

      void notificationQueue.add("notification", {
        type: "transaction",
        id: result.id,
      });
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
        from: z.coerce.date().nullish().default(subDays(new Date(), 7)),
        to: z.coerce.date().nullish().default(addDays(new Date(), 1)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const from = input.from ?? subDays(new Date(), 7);
      const to = input.to ?? addDays(new Date(), 1);
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
            gte: from,
            lte: to,
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
            gte: from,
            lte: to,
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

  getTransactionSummary: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().optional().default(subMonths(new Date(), 1)),
        to: z.coerce.date().optional().default(new Date()),
      }),
    )
    .query(async ({ input, ctx }) => {
      return getTransactionSummary({
        from: input.from,
        to: input.to,
        schoolYearId: ctx.schoolYearId,
        schoolId: ctx.schoolId,
      });
    }),
} satisfies TRPCRouterRecord;
