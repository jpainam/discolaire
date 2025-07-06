import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

const createEditTermSchema = z.object({
  name: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean(),
  order: z.number().default(0),
});
export const termRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.term.findMany({
      orderBy: {
        startDate: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.term.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(createEditTermSchema.extend({ id: z.string().min(1) }))
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
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
  get: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.db.term.findUniqueOrThrow({
      include: {
        schoolYear: true,
      },
      where: {
        id: input,
      },
    });
  }),
} satisfies TRPCRouterRecord;
