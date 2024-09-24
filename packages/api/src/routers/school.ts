import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const schoolRouter = createTRPCRouter({
  formerSchools: protectedProcedure.query(({ ctx }) => {
    return ctx.db.formerSchool.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  deleteFormerSchool: protectedProcedure
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
  updateFormerSchool: protectedProcedure
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
  createFormerSchool: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.formerSchool.create({
        data: {
          name: input.name,
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
});
