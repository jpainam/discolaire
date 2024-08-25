import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const studentAccountRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.studentAccount.findMany({
      orderBy: {
        student: {
          lastName: "asc",
        },
      },
      include: {
        student: true,
      },
    });
  }),
  get: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.studentAccount.findUnique({
      where: {
        id: input,
      },
    });
  }),
});
