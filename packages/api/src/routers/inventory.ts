import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import type { Prisma, PrismaClient } from "@repo/db";

import { protectedProcedure } from "../trpc";

const STOCK_EVENT_TYPES = ["STOCK_IN", "CONSUME", "ADJUST"] as const;
const STOCK_EVENT_TYPE_SET = new Set<string>(STOCK_EVENT_TYPES);

function isStockEventType(type: string) {
  return STOCK_EVENT_TYPE_SET.has(type);
}

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
  tx: Prisma.TransactionClient;
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

async function ensureStaffExists({
  db,
  staffId,
  schoolId,
}: {
  db: PrismaClient | Prisma.TransactionClient;
  staffId: string;
  schoolId: string;
}) {
  const staff = await db.staff.findFirst({
    where: {
      id: staffId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!staff) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Staff not found",
    });
  }
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

const createEventSchema = z
  .object({
    itemId: z.string().min(1),
    type: z.enum(["STOCK_IN", "CONSUME", "ASSIGN", "ADJUST"]),
    quantity: z.coerce.number().int().optional(),
    assigneeId: z.string().optional(),
    location: z.string().optional(),
    dueAt: z.string().optional(),
    note: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === "CONSUME" && !value.assigneeId) {
      ctx.addIssue({
        code: "custom",
        message: "Assignee is required for consumption events",
        path: ["assigneeId"],
      });
    }
    if (value.type === "ASSIGN" && !value.assigneeId) {
      ctx.addIssue({
        code: "custom",
        message: "Assignee is required for assignment events",
        path: ["assigneeId"],
      });
    }
    if (
      value.type === "STOCK_IN" &&
      value.quantity !== undefined &&
      value.quantity < 1
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Quantity must be at least 1 for stock in",
        path: ["quantity"],
      });
    }
    if (
      value.type === "CONSUME" &&
      value.quantity !== undefined &&
      value.quantity < 1
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Quantity must be at least 1 for consumption",
        path: ["quantity"],
      });
    }
    if (value.type === "ADJUST" && value.quantity === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Quantity cannot be 0 for adjustments",
        path: ["quantity"],
      });
    }
  });

const updateEventSchema = z
  .object({
    id: z.string().min(1),
    itemId: z.string().min(1),
    type: z.enum(["STOCK_IN", "CONSUME", "ASSIGN", "ADJUST"]),
    quantity: z.coerce.number().int().optional(),
    assigneeId: z.string().optional(),
    location: z.string().optional(),
    dueAt: z.string().optional(),
    returnedAt: z.string().optional(),
    note: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === "CONSUME" && !value.assigneeId) {
      ctx.addIssue({
        code: "custom",
        message: "Assignee is required for consumption events",
        path: ["assigneeId"],
      });
    }
    if (value.type === "ASSIGN" && !value.assigneeId && !value.returnedAt) {
      ctx.addIssue({
        code: "custom",
        message: "Assignee is required for active assignment events",
        path: ["assigneeId"],
      });
    }
    if (
      value.type === "STOCK_IN" &&
      value.quantity !== undefined &&
      value.quantity < 1
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Quantity must be at least 1 for stock in",
        path: ["quantity"],
      });
    }
    if (
      value.type === "CONSUME" &&
      value.quantity !== undefined &&
      value.quantity < 1
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Quantity must be at least 1 for consumption",
        path: ["quantity"],
      });
    }
    if (value.type === "ADJUST" && value.quantity === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Quantity cannot be 0 for adjustments",
        path: ["quantity"],
      });
    }
  });

function parseOptionalDate(input?: string) {
  if (input === undefined) {
    return undefined;
  }

  if (!input.trim()) {
    return null;
  }

  const value = new Date(input);
  if (Number.isNaN(value.getTime())) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid date format",
    });
  }

  return value;
}

function resolveEventQuantity({
  type,
  quantity,
  fallbackQuantity,
}: {
  type: "STOCK_IN" | "CONSUME" | "ASSIGN" | "ADJUST";
  quantity?: number;
  fallbackQuantity?: number;
}) {
  if (type === "ASSIGN") {
    return 1;
  }

  if (quantity !== undefined) {
    return quantity;
  }

  if (fallbackQuantity !== undefined) {
    return fallbackQuantity;
  }

  if (type === "ADJUST") {
    return 1;
  }

  return 1;
}

function validateEventItemCompatibility({
  trackingType,
  eventType,
}: {
  trackingType: "CONSUMABLE" | "RETURNABLE";
  eventType: "STOCK_IN" | "CONSUME" | "ASSIGN" | "ADJUST";
}) {
  if (eventType === "ASSIGN" && trackingType !== "RETURNABLE") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "ASSIGN events can only be used for returnable items",
    });
  }

  if (eventType !== "ASSIGN" && trackingType !== "CONSUMABLE") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Stock events can only be used for consumables",
    });
  }
}

async function ensureStockNotNegative({
  tx,
  itemIds,
  schoolId,
  schoolYearId,
}: {
  tx: Prisma.TransactionClient;
  itemIds: string[];
  schoolId: string;
  schoolYearId: string;
}) {
  for (const itemId of itemIds) {
    const currentStock = await getConsumableStockTx({
      tx,
      itemId,
      schoolId,
      schoolYearId,
    });

    if (currentStock < 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This change would result in negative stock",
      });
    }
  }
}

async function ensureNoActiveAssignment({
  tx,
  schoolId,
  schoolYearId,
  itemId,
  excludeEventId,
}: {
  tx: Prisma.TransactionClient;
  schoolId: string;
  schoolYearId: string;
  itemId: string;
  excludeEventId?: string;
}) {
  const activeAssignment = await tx.inventoryEvent.findFirst({
    where: {
      itemId,
      schoolId,
      schoolYearId,
      type: "ASSIGN",
      returnedAt: null,
      ...(excludeEventId ? { id: { not: excludeEventId } } : {}),
    },
    select: {
      id: true,
    },
  });

  if (activeAssignment) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Item is already assigned",
    });
  }
}

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

  consumables: protectedProcedure.query(({ ctx }) => {
    return ctx.services.inventory.getConsumables({
      schoolId: ctx.schoolId,
      schoolYearId: ctx.schoolYearId,
    });
  }),

  createEvent: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const item = await tx.inventoryItem.findFirst({
          where: {
            id: input.itemId,
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

        validateEventItemCompatibility({
          trackingType: item.trackingType,
          eventType: input.type,
        });

        if (input.assigneeId) {
          await ensureStaffExists({
            db: tx,
            staffId: input.assigneeId,
            schoolId: ctx.schoolId,
          });
        }

        if (input.type === "ASSIGN") {
          await ensureNoActiveAssignment({
            tx,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
            itemId: input.itemId,
          });
        }

        const dueAt = parseOptionalDate(input.dueAt);

        const event = await tx.inventoryEvent.create({
          data: {
            itemId: input.itemId,
            type: input.type,
            quantity: resolveEventQuantity({
              type: input.type,
              quantity: input.quantity,
            }),
            assigneeId: input.assigneeId,
            location: input.location,
            dueAt:
              input.type === "ASSIGN"
                ? (dueAt ?? item.defaultReturnDate ?? null)
                : null,
            note: input.note,
            createdById: ctx.session.user.id,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        });

        if (isStockEventType(input.type)) {
          await ensureStockNotNegative({
            tx,
            itemIds: [input.itemId],
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          });
        }

        return event;
      });
    }),

  updateEvent: protectedProcedure
    .input(updateEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const previousEvent = await tx.inventoryEvent.findFirst({
          where: {
            id: input.id,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        });

        if (!previousEvent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Inventory event not found",
          });
        }

        const item = await tx.inventoryItem.findFirst({
          where: {
            id: input.itemId,
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

        validateEventItemCompatibility({
          trackingType: item.trackingType,
          eventType: input.type,
        });

        const assigneeId =
          input.assigneeId ?? previousEvent.assigneeId ?? undefined;
        const location = input.location ?? previousEvent.location ?? undefined;
        const note = input.note ?? previousEvent.note ?? undefined;
        const dueAt = parseOptionalDate(input.dueAt);
        const returnedAt = parseOptionalDate(input.returnedAt);

        if (assigneeId) {
          await ensureStaffExists({
            db: tx,
            staffId: assigneeId,
            schoolId: ctx.schoolId,
          });
        }

        if (input.type === "ASSIGN" && !returnedAt) {
          await ensureNoActiveAssignment({
            tx,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
            itemId: input.itemId,
            excludeEventId: previousEvent.id,
          });
        }

        const updated = await tx.inventoryEvent.update({
          where: {
            id: previousEvent.id,
          },
          data: {
            itemId: input.itemId,
            type: input.type,
            quantity: resolveEventQuantity({
              type: input.type,
              quantity: input.quantity,
              fallbackQuantity: previousEvent.quantity,
            }),
            assigneeId: assigneeId ?? null,
            location: input.type === "ASSIGN" ? (location ?? null) : null,
            dueAt:
              input.type === "ASSIGN"
                ? (dueAt ??
                  previousEvent.dueAt ??
                  item.defaultReturnDate ??
                  null)
                : null,
            returnedAt:
              input.type === "ASSIGN"
                ? (returnedAt ?? previousEvent.returnedAt ?? null)
                : null,
            returnedById:
              input.type === "ASSIGN"
                ? returnedAt
                  ? ctx.session.user.id
                  : (previousEvent.returnedById ?? null)
                : null,
            note,
          },
        });

        const stockItemIds = new Set<string>();
        if (isStockEventType(previousEvent.type)) {
          stockItemIds.add(previousEvent.itemId);
        }
        if (isStockEventType(input.type)) {
          stockItemIds.add(input.itemId);
        }

        if (stockItemIds.size > 0) {
          await ensureStockNotNegative({
            tx,
            itemIds: [...stockItemIds],
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          });
        }

        return updated;
      });
    }),

  deleteEvent: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const event = await tx.inventoryEvent.findFirst({
          where: {
            id: input,
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        });

        if (!event) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Inventory event not found",
          });
        }

        await tx.inventoryEvent.delete({
          where: {
            id: event.id,
          },
        });

        if (isStockEventType(event.type)) {
          await ensureStockNotNegative({
            tx,
            itemIds: [event.itemId],
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          });
        }

        return true;
      });
    }),
} satisfies TRPCRouterRecord;
