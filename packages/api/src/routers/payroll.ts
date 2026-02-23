import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const payrollRouter = {
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(20),
        query: z.string().optional(),
        status: z.enum(["PENDING", "PAID", "CANCELED"]).optional(),
        period: z.coerce.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const q = input.query;
      return ctx.db.payroll.findMany({
        take: input.limit,
        include: {
          staff: true,
          createdBy: true,
        },
        where: {
          schoolId: ctx.schoolId,
          ...(input.status ? { status: input.status } : {}),
          ...(input.period
            ? {
                period: {
                  gte: new Date(
                    input.period.getFullYear(),
                    input.period.getMonth(),
                    1,
                  ),
                  lt: new Date(
                    input.period.getFullYear(),
                    input.period.getMonth() + 1,
                    1,
                  ),
                },
              }
            : {}),
          ...(q
            ? {
                OR: [
                  { paymentRef: { contains: q, mode: "insensitive" } },
                  {
                    staff: {
                      OR: [
                        { firstName: { contains: q, mode: "insensitive" } },
                        { lastName: { contains: q, mode: "insensitive" } },
                      ],
                    },
                  },
                ],
              }
            : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const payroll = await ctx.db.payroll.findUnique({
      where: { id: input },
      include: {
        staff: true,
        createdBy: true,
      },
    });
    if (!payroll) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Payroll with id ${input} not found`,
      });
    }
    return payroll;
  }),

  create: protectedProcedure
    .input(
      z.object({
        staffId: z.string(),
        period: z.coerce.date(),
        baseSalary: z.number(),
        deductions: z.number().default(0),
        netSalary: z.number(),
        method: z.string().optional().default("CASH"),
        observation: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const date = input.period;
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const count = await ctx.db.payroll.count({
        where: { schoolId: ctx.schoolId },
      });
      const seq = String(count + 1).padStart(4, "0");
      const paymentRef = `PAY-${year}-${month}-${seq}`;

      return ctx.db.payroll.create({
        data: {
          paymentRef,
          staffId: input.staffId,
          period: input.period,
          baseSalary: input.baseSalary,
          deductions: input.deductions,
          netSalary: input.netSalary,
          method: input.method,
          observation: input.observation,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          createdById: ctx.session.user.id,
        },
        include: {
          staff: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        staffId: z.string(),
        period: z.coerce.date(),
        baseSalary: z.number(),
        deductions: z.number().default(0),
        netSalary: z.number(),
        method: z.string().optional().default("CASH"),
        observation: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.payroll.update({
        where: { id: input.id },
        data: {
          staffId: input.staffId,
          period: input.period,
          baseSalary: input.baseSalary,
          deductions: input.deductions,
          netSalary: input.netSalary,
          method: input.method,
          observation: input.observation,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "PAID", "CANCELED"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.payroll.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.payroll.delete({
      where: { id: input },
    });
  }),
} satisfies TRPCRouterRecord;
