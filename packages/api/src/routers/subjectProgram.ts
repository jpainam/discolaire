import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const subjectProgramRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.subjectProgram.findMany({
      where: {
        term: {
          schoolYearId: ctx.schoolYearId,
        },
      },
      include: {
        term: true,
        subject: true,
        journals: true,
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.subjectProgram.findUniqueOrThrow({
      include: {
        subject: true,
        term: true,
        journals: true,
      },
      where: {
        id: input,
      },
    });
  }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectProgram.delete({
        where: {
          id: input,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(["MEDIUM", "HIGH", "URGENT"]),
        requiredSessionCount: z.number().positive().default(1),
        subjectId: z.coerce.number(),
        termId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectProgram.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          requiredSessionCount: input.requiredSessionCount,
          subjectId: input.subjectId,
          termId: input.termId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        requiredSessionCount: z.number().positive().default(1),
        termId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectProgram.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          requiredSessionCount: input.requiredSessionCount,
          termId: input.termId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
