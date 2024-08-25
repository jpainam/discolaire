import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const schoolRouter = createTRPCRouter({
  formerSchools: protectedProcedure.query(({ ctx }) => {
    return ctx.db.formerSchool.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.formerSchool.findUnique({
      where: {
        id: input,
      },
    });
  }),
});
