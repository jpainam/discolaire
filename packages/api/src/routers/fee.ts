import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { feeService } from "../services/fee-service";
import { protectedProcedure } from "../trpc";

export const feeRouter = {
  delete: protectedProcedure
    .input(z.union([z.number(), z.array(z.number())]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  get: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.fee.findUnique({
      where: {
        id: input,
      },
      include: {
        classroom: true,
      },
    });
  }),
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.fee.findMany({
      where: {
        classroom: {
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
        },
      },
      include: {
        classroom: true,
        journal: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        code: z.string().min(1),
        description: z.string().min(1),
        amount: z.coerce.number().min(0),
        dueDate: z.coerce.date(),
        classroomId: z.string().min(1),
        isActive: z.boolean().default(true),
        journalId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.create({
        data: {
          code: input.code,
          description: input.description,
          amount: input.amount,
          dueDate: input.dueDate,
          classroomId: input.classroomId,
          journalId: input.journalId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        code: z.string().min(1),
        description: z.string().min(1),
        amount: z.coerce.number().min(1),
        dueDate: z.coerce.date(),
        isActive: z.boolean().default(true),
        journalId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.update({
        where: {
          id: input.id,
        },
        data: {
          code: input.code,
          description: input.description,
          amount: input.amount,
          dueDate: input.dueDate,
          journalId: input.journalId,
        },
      });
    }),
  monthly: protectedProcedure.query(async ({ ctx }) => {
    return feeService.getMontlyFees(ctx.schoolYearId);
  }),
  trend: protectedProcedure.query(async ({ ctx }) => {
    return feeService.getAmountTrend(ctx.schoolYearId);
  }),
  
} satisfies TRPCRouterRecord;
