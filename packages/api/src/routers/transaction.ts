import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { addDays, subDays, subMonths } from "date-fns";
import { z } from "zod/v4";

import type { TransactionType } from "@repo/db/enums";
import { TransactionStatus } from "@repo/db/enums";

import { notificationQueue } from "../queue";
import { classroomService } from "../services/classroom-service";
import { protectedProcedure } from "../trpc";

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
    .query(({ input, ctx }) => {
      return ctx.services.transaction.getReceiptInfo(input);
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
  quotas: protectedProcedure
    .input(z.object({ journalId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const classrooms = await ctx.db.classroom.findMany({
        where: { schoolYearId: ctx.schoolYearId },
        include: {
          section: true,
          cycle: true,
          enrollments: { select: { studentId: true } },
        },
      });
      const feeSums = await ctx.db.fee.groupBy({
        by: ["classroomId"],
        _sum: { amount: true },
        where: {
          classroom: { schoolYearId: ctx.schoolYearId },
          ...(input?.journalId ? { journalId: input.journalId } : {}),
        },
      });

      const feeSumByClassroom: Record<string, number> = Object.fromEntries(
        feeSums.map((f) => [f.classroomId, f._sum.amount ?? 0]),
      );
      const allStudentIds = Array.from(
        new Set(
          classrooms.flatMap((c) => c.enrollments.map((e) => e.studentId)),
        ),
      );

      const txnWhereBase = {
        deletedAt: null,
        status: TransactionStatus.VALIDATED,
        schoolYearId: ctx.schoolYearId,
        ...(allStudentIds.length ? { studentId: { in: allStudentIds } } : {}),
        ...(input?.journalId ? { journalId: input.journalId } : {}),
      } as const;

      const txnByStudentType =
        allStudentIds.length === 0
          ? []
          : await ctx.db.transaction.groupBy({
              by: ["studentId", "transactionType"],
              _sum: { amount: true },
              where: txnWhereBase,
            });

      // studentId → signed total (CREDIT/DISCOUNT add, DEBIT subtract)
      const paidByStudent: Record<string, number> = {};
      for (const row of txnByStudentType) {
        const sid = row.studentId;
        const amt = row._sum.amount ?? 0;
        const t = row.transactionType;

        // sign: DEBIT = -1, everything else = +1 (covers CREDIT & DISCOUNT)
        const signed = t === "DEBIT" ? -amt : amt;
        paidByStudent[sid] = (paidByStudent[sid] ?? 0) + signed;
      }
      return classrooms.map((c) => {
        const studentIds = c.enrollments.map((e) => e.studentId);
        const headcount = studentIds.length;

        const paid = studentIds.reduce(
          (sum, sid) => sum + (paidByStudent[sid] ?? 0),
          0,
        );

        const perStudentFee = feeSumByClassroom[c.id] ?? 0;
        const revenue = perStudentFee * headcount;

        return {
          classroomId: c.id,
          classroom: c.name,
          reportName: c.reportName,
          effectif: headcount,
          section: c.section?.name ?? "",
          cycle: c.cycle?.name ?? "",
          paid,
          revenue,
          remaining: Math.abs(revenue - paid),
        };
      });
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
  trends: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().nullable(),
        to: z.coerce.date().nullable(),
        classroomId: z.string().nullable(),
        journalId: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.services.transaction.getTransactionTrends({
        from: input.from,
        to: input.to,
        classroomId: input.classroomId,
        journalId: input.journalId,
        schoolYearId: ctx.schoolYearId,
      });
    }),
  stats: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().nullish().default(subDays(new Date(), 7)),
        to: z.coerce.date().nullish().default(addDays(new Date(), 1)),
        classroomId: z.string().nullable(),
        journalId: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.services.transaction.getTransactionStats({
        from: input.from,
        to: input.to,
        classroomId: input.classroomId,
        journalId: input.journalId,
        schoolYearId: ctx.schoolYearId,
      });
    }),

  getLastDaysDailySummary: protectedProcedure
    .input(z.object({ number_of_days: z.coerce.number().default(60) }))
    .query(({ ctx, input }) => {
      return ctx.services.transaction.getLastDaysDailySummary({
        schoolYearId: ctx.schoolYearId,
        days: input.number_of_days,
      });
    }),

  markPrinted: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        printedAt: z.date(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          printedAt: input.printedAt,
          printedById: ctx.session.user.id,
        },
      });
    }),
} satisfies TRPCRouterRecord;
