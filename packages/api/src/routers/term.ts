import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEditTermSchema = z.object({
  name: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean(),
  order: z.number().default(0),
});
export const termRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.term.findMany({
      orderBy: {
        startDate: "asc",
      },
      where: {
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.term.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(createEditTermSchema.extend({ id: z.coerce.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.term.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  create: protectedProcedure
    .input(createEditTermSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.term.create({
        data: {
          ...input,
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.term.findUnique({
      where: {
        id: input,
      },
    });
  }),
});
