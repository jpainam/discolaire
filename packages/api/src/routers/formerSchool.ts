import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

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
  search: protectedProcedure
    .input(z.object({ q: z.string().default("") }))
    .query(({ ctx, input }) => {
      const qq = `%${input.q}%`;
      return ctx.db.formerSchool.findMany({
        take: 10,
        where: {
          schoolId: ctx.schoolId,
          name: {
            contains: qq,
            mode: "insensitive",
          },
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
