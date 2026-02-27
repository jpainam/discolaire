import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const termReportConfigRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.termReportConfig.findMany({
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        termId: z.string().min(1),
        examStartDate: z.coerce.date().nullish(),
        examEndDate: z.coerce.date().nullish(),
        resultPublishedAt: z.coerce.date().nullish(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.termReportConfig.upsert({
        where: { termId: input.termId },
        create: {
          termId: input.termId,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          examStartDate: input.examStartDate ?? null,
          examEndDate: input.examEndDate ?? null,
          resultPublishedAt: input.resultPublishedAt ?? null,
        },
        update: {
          examStartDate: input.examStartDate ?? null,
          examEndDate: input.examEndDate ?? null,
          resultPublishedAt: input.resultPublishedAt ?? null,
        },
      });
    }),
} satisfies TRPCRouterRecord;
