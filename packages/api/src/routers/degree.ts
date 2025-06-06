import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const degreeRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.degree.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  delete: protectedProcedure.input(z.number()).mutation(({ input, ctx }) => {
    return ctx.db.degree.delete({
      where: {
        id: input,
      },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        name: z.string().min(1),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.degree.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.degree.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
