import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const menuRouter = {
  byCategory: protectedProcedure
    .input(
      z.object({
        category: z.enum(["student", "classroom"]),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.menuItem.findMany({
        where: {
          category: input.category,
          isActive: true,
        },

        orderBy: {
          order: "asc",
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.menuItem.delete({ where: { id: input.id } });
    }),
} satisfies TRPCRouterRecord;
