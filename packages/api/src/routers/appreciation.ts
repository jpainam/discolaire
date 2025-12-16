import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const appreciationRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.appreciation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  categories: protectedProcedure.query(({ ctx }) => {
    return ctx.db.appreciationCategory.findMany({
      include: {
        appreciations: true,
      },
      where: {
        isActive: true,
      },
    });
  }),
  get: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.appreciation.findUniqueOrThrow({
      where: {
        id: input,
      },
    });
  }),
} satisfies TRPCRouterRecord;
