import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const termRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.term.findMany({
      orderBy: {
        startDate: "asc",
      },
      where: {
        schoolYearId: ctx.session.schoolYearId,
      },
    });
  }),
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.term.findUnique({
      where: {
        id: input,
      },
    });
  }),
});
