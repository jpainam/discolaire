import { z } from "zod";

import { schoolYearService } from "../services/school-year-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const schoolYearRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.schoolYear.findMany({
      orderBy: {
        startDate: "desc",
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.schoolYear.findUnique({
      where: {
        id: input,
      },
    });
  }),
  getDefault: protectedProcedure.query(() => {
    return schoolYearService.getDefault();
  }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.schoolYear.delete({ where: { id: input } });
    }),
});
