import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const formerShoolRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.formerSchool.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.formerSchool.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ name: z.string().min(1), id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.formerSchool.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.formerSchool.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.formerSchool.findUnique({
      where: {
        id: input,
      },
    });
  }),
} satisfies TRPCRouterRecord;
