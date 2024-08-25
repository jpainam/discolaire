import { z } from "zod";

import { feeService } from "../services/fee-service";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const feeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.delete({ where: { id: input.id } });
    }),
  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.fee.findUnique({
        where: {
          id: input.id,
        },
        include: {
          classroom: true,
          journal: true,
        },
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.fee.findMany({
      where: {
        classroom: {
          schoolYearId: ctx.session.schoolYearId,
        },
      },
      include: {
        classroom: true,
        journal: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        code: z.string().min(1),
        description: z.string().min(1),
        amount: z.number().min(1),
        dueDate: z.date(),
        journalId: z.number(),
        classroomId: z.string(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.create({
        data: {
          code: input.code,
          description: input.description,
          amount: input.amount,
          dueDate: input.dueDate,
          journal: { connect: { id: input.journalId } },
          classroom: { connect: { id: input.classroomId } },
          isActive: input.isActive,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        code: z.string().min(1),
        description: z.string().min(1),
        amount: z.number().min(1),
        dueDate: z.date(),
        journalId: z.number(),
        isActive: z.boolean().default(true),
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
          journal: { connect: { id: input.journalId } },
          isActive: input.isActive,
        },
      });
    }),
  monthly: protectedProcedure.query(async ({ ctx }) => {
    return feeService.getMontlyFees(ctx.session.schoolYearId);
  }),
  trend: protectedProcedure.query(async ({ ctx }) => {
    return feeService.getAmountTrend(ctx.session.schoolYearId);
  }),
});
