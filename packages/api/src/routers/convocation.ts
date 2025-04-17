import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const convocationRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z
        .object({
          from: z.coerce.date().optional(),
          to: z.coerce.date().optional(),
        })
        .optional(),
    )
    .query(({ ctx }) => {
      return ctx.db.convocation.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          student: true,
        },
        where: {
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
    }),
});
