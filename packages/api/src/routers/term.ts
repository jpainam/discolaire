import { TRPCError } from "@trpc/server";
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
        schoolId: ctx.schoolId,
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
          schoolId: ctx.schoolId,
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
  fromTrimestre: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const terms = await ctx.db.term.findMany({
        where: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });

      if (!["trim1", "trim2", "trim3"].includes(input)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trimestre not found",
        });
      }
      if (input === "trim1") {
        return {
          seq1: terms.find((t) => t.order === 1),
          seq2: terms.find((t) => t.order === 2),
        };
      } else if (input === "trim2") {
        return {
          seq1: terms.find((t) => t.order === 3),
          seq2: terms.find((t) => t.order === 4),
        };
      } else {
        return {
          seq1: terms.find((t) => t.order === 5),
          seq2: terms.find((t) => t.order === 6),
        };
      }
    }),
});
