import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const programRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.program.findMany({
      orderBy: {
        startDate: "desc",
      },
      where: {
        schoolYearId: ctx.schoolYearId,
      },
      include: {
        category: true,
        theme: true,
        documents: true,
      },
    });
  }),
  themes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.programTheme.findMany({
      where: {
        schoolYearId: ctx.schoolYearId,
      },
      include: {
        course: true,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.array(z.number()), z.number()]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.program.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),

  get: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.program.findUnique({
      include: {
        category: true,
        theme: true,
        documents: true,
      },
      where: {
        id: input,
      },
    });
  }),
});
