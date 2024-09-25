import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateStringColor } from "../utils";

export const courseRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.delete({ where: { id: input.id } });
    }),
  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.course.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        shortName: z.string().min(1),
        reportName: z.string().min(1),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.create({
        data: {
          shortName: input.shortName,
          name: input.name,
          reportName: input.reportName,
          isActive: input.isActive,
          schoolId: ctx.schoolId,
          color: generateStringColor(),
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
});
