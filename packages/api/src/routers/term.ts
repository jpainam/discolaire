import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { TermType } from "@repo/db/enums";

import { protectedProcedure } from "../trpc";

const createEditTermSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  type: z.enum([
    TermType.MONTHLY,
    TermType.QUARTER,
    TermType.HALF,
    TermType.ANNUAL,
  ]),
  order: z.number().default(1),
  parts: z.string().array(),
});
export const termRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.term.findMany({
      include: {
        schoolYear: true,
        parts: true,
      },
      orderBy: {
        order: "asc",
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
      return ctx.db.$transaction(async (tx) => {
        // 1) Update the Period (Term)
        await tx.term.update({
          where: { id: input.id },
          data: {
            type: input.type,
            name: input.name,
            startDate: input.startDate,
            endDate: input.endDate,
            shortName: input.shortName,
            order: input.order,
          },
        });

        await tx.termPart.deleteMany({
          where: { parentId: input.id },
        });

        const uniqueChildIds = Array.from(new Set(input.parts));

        await tx.termPart.createMany({
          data: uniqueChildIds.map((childId) => ({
            parentId: input.id,
            childId,
          })),
        });

        return tx.term.findUnique({
          where: { id: input.id },
          include: {
            parts: { include: { child: true } },
          },
        });
      });
    }),
  create: protectedProcedure
    .input(createEditTermSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const period = await tx.term.create({
          data: {
            schoolYearId: ctx.schoolYearId,
            schoolId: ctx.schoolId,
            type: input.type,
            shortName: input.shortName,
            name: input.name,
            startDate: input.startDate,
            endDate: input.endDate,
            isActive: true,
            order: input.order,
          },
        });

        await tx.termPart.createMany({
          data: input.parts.map((childId) => ({
            parentId: period.id,
            childId,
          })),
        });

        return period;
      });
    }),
  get: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.db.term.findUniqueOrThrow({
      include: {
        schoolYear: true,
        parts: true,
      },
      where: {
        id: input,
      },
    });
  }),
  lock: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isActive: z.coerce.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.term.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: input.isActive,
        },
      });
    }),
} satisfies TRPCRouterRecord;
