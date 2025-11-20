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
        trimestreId: z.enum(["trim1", "trim2", "trim3"]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [seq1, seq2] = await ctx.services.attendance.getTrimesterTermIds(
        input.trimestreId,
        ctx.schoolYearId,
      );

      const result = await ctx.services.attendance.getDisciplineForTerms({
        classroomId: input.classroomId,
        termIds: [seq1, seq2],
      });

      return result;
    }),
} satisfies TRPCRouterRecord;
