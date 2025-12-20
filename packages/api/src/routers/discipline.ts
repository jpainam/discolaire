import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const disciplineRouter = {
  annual: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const terms = await ctx.db.term.findMany({
        where: {
          schoolYearId: ctx.schoolYearId,
        },
      });
      const termIds = terms.map((t) => t.id);
      const result = await ctx.services.attendance.getDisciplineForTerms({
        classroomId: input.classroomId,
        termIds: termIds,
      });
      return result;
    }),

  sequence: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.services.attendance.getDisciplineForTerms({
        classroomId: input.classroomId,
        termIds: [input.termId],
      });
      return result;
    }),

  // Trimestre = two terms
  trimestre: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const term = await ctx.db.term.findUniqueOrThrow({
        include: {
          parts: true,
        },
        where: {
          id: input.termId,
        },
      });
      const result = await ctx.services.attendance.getDisciplineForTerms({
        classroomId: input.classroomId,
        termIds: term.parts.map((p) => p.childId),
      });

      return result;
    }),
} satisfies TRPCRouterRecord;
