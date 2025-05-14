import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const inventoryRouter = createTRPCRouter({
  assets: protectedProcedure.query(({ ctx }) => {
    return ctx.db.asset.findMany({
      where: {
        item: {
          schoolId: ctx.schoolId,
        },
      },
      include: {
        item: {
          include: {
            category: true,
          },
        },
      },
    });
  }),
  consumables: protectedProcedure.query(({ ctx }) => {
    return ctx.db.consumableUsage.findMany({
      where: {
        item: {
          schoolId: ctx.schoolId,
        },
      },
      include: {
        item: {
          include: {
            category: true,
          },
        },
      },
    });
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
    .input(
      z.object({
        name: z.string(),
        sku: z.string().optional(),
        unitId: z.string(),
        currentStock: z.number().default(0),
        categoryId: z.string(),
      }),
    )
    .mutation(() => {
      return true;
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
});
