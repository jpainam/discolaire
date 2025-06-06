import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const journalRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.journal.findMany();
  }),
  get: protectedProcedure
    .input(z.object({ id: z.coerce.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.journal.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.coerce.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.journal.delete({
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.journal.create({
        data: input,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.journal.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
} satisfies TRPCRouterRecord;
