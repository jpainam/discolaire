import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const employmentTypeRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.employmentType.findMany({});
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.employmentType.update({
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
    .mutation(async ({ ctx, input }) => {
      return ctx.db.employmentType.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
