import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const inventoryRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const assets = await ctx.db.inventoryAsset.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
    });
    const consumables = await ctx.db.inventoryConsumable.findMany({
      include: {
        unit: true,
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
    const items: {
      id: string;
      type: "ASSET" | "CONSUMABLE";
      name: string;
      note: string | null;
      schoolId: string;
      schoolYearId: string;
      other: Record<string, string | null>;
    }[] = [];
    assets.forEach((asset) => {
      items.push({
        id: asset.id,
        type: "ASSET",
        schoolId: asset.schoolId,
        schoolYearId: asset.schoolYearId,
        name: asset.name,
        note: asset.note ? asset.note.replace(/(\r\n|\n|\r)/g, ",") : null,
        other: {
          sku: asset.sku,
          serial: asset.serial,
        },
      });
    });
    consumables.forEach((consumable) => {
      items.push({
        id: consumable.id,
        type: "CONSUMABLE",
        name: consumable.name,
        schoolId: consumable.schoolId,
        schoolYearId: consumable.schoolYearId,
        note: consumable.note
          ? consumable.note.replace(/(\r\n|\n|\r)/g, ",")
          : null,
        other: {
          currentStock: consumable.currentStock.toString(),
          minLevelStock: consumable.minStockLevel.toString(),
          unitId: consumable.unitId,
          unitName: consumable.unit.name,
        },
      });
    });
    return items;
  }),
  units: protectedProcedure.query(({ ctx }) => {
    return ctx.db.inventoryUnit.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        name: "desc",
      },
    });
  }),
  assets: protectedProcedure.query(({ ctx }) => {
    return ctx.db.inventoryAsset.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  createUnit: protectedProcedure
    .input(
      z.object({
        name: z.string().min(5),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryUnit.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
  updateUnit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(5),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryUnit.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });
    }),
  createAsset: protectedProcedure
    .input(
      z.object({
        name: z.string().min(5),
        sku: z.string().optional(),
        serial: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryAsset.create({
        data: {
          ...input,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
  updateAsset: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(5),
        sku: z.string().optional(),
        serial: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryAsset.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),

  consumables: protectedProcedure.query(({ ctx }) => {
    return ctx.db.inventoryConsumable.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        name: "desc",
      },
    });
  }),

  deleteAsset: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryAsset.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteConsumable: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryConsumable.delete({
        where: {
          id: input,
        },
      });
    }),
  createConsumable: protectedProcedure
    .input(
      z.object({
        name: z.string().min(5),
        minStockLevel: z.number().min(0),
        unitId: z.string().min(1),
        note: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryConsumable.create({
        data: {
          ...input,
          currentStock: 0,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
  updateConsumable: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(5),
        minStockLevel: z.number().min(0),
        unitId: z.string().min(1),
        note: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryConsumable.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
