import { z } from "zod";

import { db } from "@repo/db";

import { getAllAssets, getAllConsumables } from "../services/inventory-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const inventoryRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const assets = await getAllAssets({
      schoolId: ctx.schoolId,
      schoolYearId: ctx.schoolYearId,
    });
    const consumables = await getAllConsumables({
      schoolId: ctx.schoolId,
      schoolYearId: ctx.schoolYearId,
    });
    return [...assets, ...consumables];
  }),
  units: protectedProcedure.query(({ ctx }) => {
    return ctx.db.inventoryUnit.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        consumables: true,
      },
      orderBy: {
        name: "desc",
      },
    });
  }),
  deleteUnit: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryUnit.delete({
        where: {
          id: input,
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
  deleteUsage: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryConsumableUsage.delete({
        where: {
          id: input,
        },
      });
    }),

  consumableUsages: protectedProcedure.query(({ ctx }) => {
    return ctx.db.inventoryConsumableUsage.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        createdBy: true,
        consumable: {
          include: {
            unit: true,
          },
        },
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

  createConsumableUsage: protectedProcedure
    .input(
      z.object({
        consumableId: z.string().min(1),
        userId: z.string().min(1),
        quantity: z.coerce.number().min(1).max(1000),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const v = await ctx.db.inventoryConsumableUsage.create({
        data: {
          consumableId: input.consumableId,
          userId: input.userId,
          quantity: input.quantity,
          note: input.note,
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
      await syncStockQuantity({
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
        consumableId: input.consumableId,
      });
      return v;
    }),
  updateStockMovement: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        consumableId: z.string().min(1),
        quantity: z.coerce.number().min(1).max(1000),
        type: z.enum(["IN", "OUT", "ADJUST"]).default("IN"),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const movement = await ctx.db.inventoryStockMovement.update({
        data: {
          ...input,
        },
        where: {
          id: input.id,
        },
      });
      await syncStockQuantity({
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
        consumableId: input.consumableId,
      });
      return movement;
    }),
  createStockMovement: protectedProcedure
    .input(
      z.object({
        consumableId: z.string().min(1),
        quantity: z.coerce.number().min(1).max(1000),
        type: z.enum(["IN", "OUT", "ADJUST"]).default("IN"),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const movement = await ctx.db.inventoryStockMovement.create({
        data: {
          ...input,
          schoolId: ctx.schoolId,
          createdById: ctx.session.user.id,
          schoolYearId: ctx.schoolYearId,
        },
      });

      await syncStockQuantity({
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
        consumableId: input.consumableId,
      });

      return movement;
    }),
  createAssetUsage: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        assetId: z.string().min(1),
        location: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.inventoryAssetUsage.create({
        data: {
          userId: input.userId,
          assetId: input.assetId,
          location: input.location,
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
  updateAssetUsage: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        userId: z.string().min(1),
        assetId: z.string().min(1),
        location: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.inventoryAssetUsage.update({
        where: {
          id: input.id,
        },
        data: {
          userId: input.userId,
          assetId: input.assetId,
          location: input.location,
        },
      });
    }),
});

async function syncStockQuantity({
  schoolId,
  schoolYearId,
  consumableId,
}: {
  schoolId: string;
  schoolYearId: string;
  consumableId: string;
}) {
  const allMovements = await db.inventoryStockMovement.findMany({
    where: {
      schoolId: schoolId,
      schoolYearId: schoolYearId,
    },
  });
  const currentStock = allMovements.reduce((acc, movement) => {
    if (movement.type === "OUT") {
      return acc - movement.quantity;
    } else {
      return acc + movement.quantity;
    }
  }, 0);

  const usages = await db.inventoryConsumableUsage.findMany({
    where: {
      consumableId: consumableId,
      schoolId: schoolId,
      schoolYearId: schoolYearId,
    },
  });
  const usageStock = usages.reduce((acc, usage) => {
    return acc + usage.quantity;
  }, 0);
  await db.inventoryConsumable.update({
    where: {
      id: consumableId,
    },
    data: {
      currentStock: currentStock - usageStock,
    },
  });
}
