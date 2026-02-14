import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

function computeConsumableStock(events: { type: string; quantity: number }[]) {
  return events.reduce((acc, event) => {
    if (event.type === "STOCK_IN") {
      return acc + event.quantity;
    }
    if (event.type === "CONSUME") {
      return acc - event.quantity;
    }
    if (event.type === "ADJUST") {
      return acc + event.quantity;
    }
    return acc;
  }, 0);
}

async function getConsumableStockTx({
  tx,
  itemId,
  schoolId,
  schoolYearId,
}: {
  tx: any;
  itemId: string;
  schoolId: string;
  schoolYearId: string;
}) {
  const events = await tx.inventoryEvent.findMany({
    where: {
      itemId,
      schoolId,
      schoolYearId,
      type: {
        in: ["STOCK_IN", "CONSUME", "ADJUST"],
      },
    },
    select: {
      type: true,
      quantity: true,
    },
  });

  return computeConsumableStock(events);
}

const unifiedItemSchema = z
  .object({
    name: z.string().min(2),
    trackingType: z.enum(["CONSUMABLE", "RETURNABLE"]),
    unitId: z.string().optional(),
    minStockLevel: z.coerce.number().min(0).optional(),
    sku: z.string().optional(),
    serial: z.string().optional(),
    note: z.string().optional(),
    defaultReturnDate: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.trackingType === "CONSUMABLE" && !value.unitId) {
      ctx.addIssue({
        code: "custom",
        message: "Unit is required for consumables",
        path: ["unitId"],
      });
    }
  });

export const inventoryRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.services.inventory.getAllItems({
      schoolId: ctx.schoolId,
      schoolYearId: ctx.schoolYearId,
    });
  }),

  events: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.inventoryEvent.findMany({
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
      include: {
        item: {
          include: {
            unit: true,
          },
        },
        assignee: true,
        createdBy: true,
        returnedBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  units: protectedProcedure.query(({ ctx }) => {
    return ctx.db.inventoryUnit.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        items: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),

  deleteUnit: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const unit = await ctx.db.inventoryUnit.findFirst({
        where: {
          id: input,
          schoolId: ctx.schoolId,
        },
      });

      if (!unit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stock unit not found",
        });
      }

      return ctx.db.inventoryUnit.delete({
        where: {
          id: unit.id,
        },
      });
    }),

  createUnit: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
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
        name: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const unit = await ctx.db.inventoryUnit.findFirst({
        where: {
          id: input.id,
          schoolId: ctx.schoolId,
        },
      });

      if (!unit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stock unit not found",
        });
      }

      return ctx.db.inventoryUnit.update({
        where: {
          id: unit.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  createItem: protectedProcedure
    .input(unifiedItemSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryItem.create({
        data: {
          name: input.name,
          trackingType: input.trackingType,
          unitId: input.trackingType === "CONSUMABLE" ? input.unitId : null,
          minStockLevel:
            input.trackingType === "CONSUMABLE"
              ? (input.minStockLevel ?? 0)
              : null,
          sku: input.trackingType === "RETURNABLE" ? input.sku : null,
          serial: input.trackingType === "RETURNABLE" ? input.serial : null,
          defaultReturnDate:
            input.trackingType === "RETURNABLE" && input.defaultReturnDate
              ? new Date(input.defaultReturnDate)
              : null,
          note: input.note,
          schoolId: ctx.schoolId,
        },
      });
    }),

  updateItem: protectedProcedure
    .input(
      unifiedItemSchema.extend({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.inventoryItem.findFirst({
        where: {
          id: input.id,
          schoolId: ctx.schoolId,
          isActive: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Inventory item not found",
        });
      }

      return ctx.db.inventoryItem.update({
        where: {
          id: item.id,
        },
        data: {
          name: input.name,
          trackingType: input.trackingType,
          unitId: input.trackingType === "CONSUMABLE" ? input.unitId : null,
          minStockLevel:
            input.trackingType === "CONSUMABLE"
              ? (input.minStockLevel ?? 0)
              : null,
          sku: input.trackingType === "RETURNABLE" ? input.sku : null,
          serial: input.trackingType === "RETURNABLE" ? input.serial : null,
          defaultReturnDate:
            input.trackingType === "RETURNABLE" && input.defaultReturnDate
              ? new Date(input.defaultReturnDate)
              : null,
          note: input.note,
        },
      });
    }),

  deleteItem: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.inventoryItem.findFirst({
        where: {
          id: input,
          schoolId: ctx.schoolId,
          isActive: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Inventory item not found",
        });
      }

      return ctx.db.inventoryItem.update({
        where: {
          id: item.id,
        },
        data: {
          isActive: false,
        },
      });
    }),

  // Legacy endpoints kept for UI compatibility while migrating to unified item flow
  assets: protectedProcedure.query(({ ctx }) => {
    return ctx.db.inventoryItem.findMany({
      where: {
        schoolId: ctx.schoolId,
        trackingType: "RETURNABLE",
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  createAsset: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        sku: z.string().optional(),
        serial: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryItem.create({
        data: {
          name: input.name,
          trackingType: "RETURNABLE",
          sku: input.sku,
          serial: input.serial,
          note: input.note,
          schoolId: ctx.schoolId,
        },
      });
    }),

  updateAsset: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(2),
        sku: z.string().optional(),
        serial: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.inventoryItem.findFirst({
        where: {
          id: input.id,
          schoolId: ctx.schoolId,
          trackingType: "RETURNABLE",
          isActive: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Asset not found",
        });
      }

      return ctx.db.inventoryItem.update({
        where: {
          id: item.id,
        },
        data: {
          name: input.name,
          sku: input.sku,
          serial: input.serial,
          note: input.note,
        },
      });
    }),

  deleteAsset: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.inventoryItem.findFirst({
        where: {
          id: input,
          schoolId: ctx.schoolId,
          trackingType: "RETURNABLE",
          isActive: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Asset not found",
        });
      }

      return ctx.db.inventoryItem.update({
        where: {
          id: item.id,
        },
        data: {
          isActive: false,
        },
      });
    }),

  consumables: protectedProcedure.query(({ ctx }) => {
    return ctx.services.inventory.getConsumables({
      schoolId: ctx.schoolId,
      schoolYearId: ctx.schoolYearId,
    });
  }),

  createConsumable: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        minStockLevel: z.number().min(0),
        unitId: z.string().min(1),
        note: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.inventoryItem.create({
        data: {
          name: input.name,
          trackingType: "CONSUMABLE",
          unitId: input.unitId,
          minStockLevel: input.minStockLevel,
          note: input.note,
          schoolId: ctx.schoolId,
        },
      });
    }),

  updateConsumable: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(2),
        minStockLevel: z.number().min(0),
        unitId: z.string().min(1),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.inventoryItem.findFirst({
        where: {
          id: input.id,
          schoolId: ctx.schoolId,
          trackingType: "CONSUMABLE",
          isActive: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Consumable not found",
        });
      }

      return ctx.db.inventoryItem.update({
        where: {
          id: item.id,
        },
        data: {
          name: input.name,
          minStockLevel: input.minStockLevel,
          unitId: input.unitId,
          note: input.note,
        },
      });
    }),

  deleteConsumable: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.inventoryItem.findFirst({
        where: {
          id: input,
          schoolId: ctx.schoolId,
          trackingType: "CONSUMABLE",
          isActive: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Consumable not found",
        });
      }

      return ctx.db.inventoryItem.update({
        where: {
          id: item.id,
        },
        data: {
          isActive: false,
        },
      });
    }),

  consumableUsages: protectedProcedure.query(({ ctx }) => {
    return ctx.db.inventoryEvent
      .findMany({
        where: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          type: "CONSUME",
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          assignee: true,
          createdBy: true,
          item: {
            include: {
              unit: true,
            },
          },
        },
      })
      .then((events) => {
        return events.map((event) => ({
          id: event.id,
          userId: event.assigneeId ?? "",
          user: event.assignee,
          quantity: event.quantity,
          note: event.note,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          consumableId: event.itemId,
          consumable: {
            id: event.item.id,
            name: event.item.name,
            unitId: event.item.unitId,
            unit: event.item.unit,
          },
          schoolYearId: event.schoolYearId,
          schoolId: event.schoolId,
          createdById: event.createdById,
          createdBy: event.createdBy,
        }));
      });
  }),

  deleteUsage: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const usage = await ctx.db.inventoryEvent.findFirst({
        where: {
          id: input,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          type: "CONSUME",
        },
      });

      if (!usage) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usage record not found",
        });
      }

      return ctx.db.inventoryEvent.delete({
        where: {
          id: usage.id,
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
      return ctx.db.$transaction(async (tx) => {
        const item = await tx.inventoryItem.findFirst({
          where: {
            id: input.consumableId,
            schoolId: ctx.schoolId,
            trackingType: "CONSUMABLE",
            isActive: true,
          },
        });

        if (!item) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Consumable not found",
          });
        }

        const usage = await tx.inventoryEvent.create({
          data: {
            itemId: input.consumableId,
            type: "CONSUME",
            quantity: input.quantity,
            assigneeId: input.userId,
            note: input.note,
            createdById: ctx.session.user.id,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        });

        const currentStock = await getConsumableStockTx({
          tx,
          itemId: input.consumableId,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        });

        if (currentStock < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient stock for this withdrawal",
          });
        }

        return usage;
      });
    }),

  updateConsumableUsage: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        consumableId: z.string().min(1),
        userId: z.string().min(1),
        quantity: z.coerce.number().min(1).max(1000),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const event = await tx.inventoryEvent.findFirst({
          where: {
            id: input.id,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
            type: "CONSUME",
          },
        });

        if (!event) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Usage record not found",
          });
        }

        await tx.inventoryEvent.update({
          where: {
            id: event.id,
          },
          data: {
            itemId: input.consumableId,
            assigneeId: input.userId,
            quantity: input.quantity,
            note: input.note,
          },
        });

        const currentStock = await getConsumableStockTx({
          tx,
          itemId: input.consumableId,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        });

        if (currentStock < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient stock for this withdrawal",
          });
        }

        if (event.itemId !== input.consumableId) {
          const previousStock = await getConsumableStockTx({
            tx,
            itemId: event.itemId,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          });
          if (previousStock < 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Previous item stock became invalid",
            });
          }
        }

        return true;
      });
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
      return ctx.db.$transaction(async (tx) => {
        const item = await tx.inventoryItem.findFirst({
          where: {
            id: input.consumableId,
            schoolId: ctx.schoolId,
            trackingType: "CONSUMABLE",
            isActive: true,
          },
        });

        if (!item) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Consumable not found",
          });
        }

        const movementType = input.type === "IN" ? "STOCK_IN" : "ADJUST";
        const movementQuantity =
          input.type === "OUT" ? -input.quantity : input.quantity;

        const movement = await tx.inventoryEvent.create({
          data: {
            itemId: input.consumableId,
            type: movementType,
            quantity: movementQuantity,
            note: input.note,
            createdById: ctx.session.user.id,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        });

        const currentStock = await getConsumableStockTx({
          tx,
          itemId: input.consumableId,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        });

        if (currentStock < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This movement would result in negative stock",
          });
        }

        return movement;
      });
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
      return ctx.db.$transaction(async (tx) => {
        const event = await tx.inventoryEvent.findFirst({
          where: {
            id: input.id,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
            type: {
              in: ["STOCK_IN", "ADJUST"],
            },
          },
        });

        if (!event) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Stock movement not found",
          });
        }

        const movementType = input.type === "IN" ? "STOCK_IN" : "ADJUST";
        const movementQuantity =
          input.type === "OUT" ? -input.quantity : input.quantity;

        const updated = await tx.inventoryEvent.update({
          where: {
            id: event.id,
          },
          data: {
            itemId: input.consumableId,
            type: movementType,
            quantity: movementQuantity,
            note: input.note,
          },
        });

        const currentStock = await getConsumableStockTx({
          tx,
          itemId: input.consumableId,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        });

        if (currentStock < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This movement would result in negative stock",
          });
        }

        if (event.itemId !== input.consumableId) {
          const previousStock = await getConsumableStockTx({
            tx,
            itemId: event.itemId,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          });
          if (previousStock < 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Previous item stock became invalid",
            });
          }
        }

        return updated;
      });
    }),

  createAssetUsage: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        assetId: z.string().min(1),
        location: z.string().optional(),
        note: z.string().optional(),
        dueAt: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.inventoryItem.findFirst({
        where: {
          id: input.assetId,
          schoolId: ctx.schoolId,
          trackingType: "RETURNABLE",
          isActive: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Returnable item not found",
        });
      }

      const activeAssignment = await ctx.db.inventoryEvent.findFirst({
        where: {
          itemId: input.assetId,
          schoolId: ctx.schoolId,
          type: "ASSIGN",
          returnedAt: null,
        },
      });

      if (activeAssignment) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Item is already assigned",
        });
      }

      return ctx.db.inventoryEvent.create({
        data: {
          itemId: input.assetId,
          type: "ASSIGN",
          quantity: 1,
          assigneeId: input.userId,
          location: input.location,
          note: input.note,
          dueAt: input.dueAt
            ? new Date(input.dueAt)
            : (item.defaultReturnDate ?? null),
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
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
        note: z.string().optional(),
        dueAt: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.db.inventoryEvent.findFirst({
        where: {
          id: input.id,
          itemId: input.assetId,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          type: "ASSIGN",
        },
      });

      if (!assignment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment not found",
        });
      }

      return ctx.db.inventoryEvent.update({
        where: {
          id: assignment.id,
        },
        data: {
          assigneeId: input.userId,
          location: input.location,
          note: input.note,
          dueAt: input.dueAt ? new Date(input.dueAt) : assignment.dueAt,
        },
      });
    }),

  returnAssetUsage: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.db.inventoryEvent.findFirst({
        where: {
          id: input.id,
          schoolId: ctx.schoolId,
          type: "ASSIGN",
        },
      });

      if (!assignment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment not found",
        });
      }

      if (assignment.returnedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item is already returned",
        });
      }

      return ctx.db.inventoryEvent.update({
        where: {
          id: assignment.id,
        },
        data: {
          returnedAt: new Date(),
          returnedById: ctx.session.user.id,
          note: input.note ?? assignment.note,
        },
      });
    }),
} satisfies TRPCRouterRecord;
