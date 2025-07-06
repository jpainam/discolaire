import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const degreeRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.staffDegree.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.db.staffDegree.delete({
      where: {
        id: input,
      },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.staffDegree.update({
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
      return ctx.db.staffDegree.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
