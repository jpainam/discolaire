import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const schoolYearEventRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.schoolYearEvent.findMany({
      orderBy: {
        date: "asc",
      },
      where: {
        schoolYearId: ctx.schoolYearId,
        schoolId: ctx.schoolId,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEvent.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        date: z.coerce.date(),
        typeId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEvent.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          date: input.date,
          typeId: input.typeId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        date: z.coerce.date(),
        typeId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEvent.create({
        data: {
          name: input.name,
          date: input.date,
          typeId: input.typeId,
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
        },
      });
    }),
});
