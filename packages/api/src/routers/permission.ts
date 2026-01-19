import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const permissionRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.permission.findMany({});
  }),

  create: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipient.create({
        data: {
          userId: input.userId,
          groupId: input.groupId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.permission.delete({
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
