import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const feedbackRouter = {
  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.feedback.delete({ where: { id: input } });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.feedback.create({
        data: {
          content: input.content,
          createdById: ctx.session.user.id,
        },
      });
    }),
} satisfies TRPCRouterRecord;
