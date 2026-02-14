import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";
import { getFullName } from "../utils";

function monthKey(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
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

function getAssigneeDisplayName(
  assignee?: {
    firstName?: string | null;
    lastName?: string | null;
    middleName?: string | null;
    name?: string | null;
    email?: string | null;
  } | null,
): string {
  if (!assignee) {
    return "";
  }

  const fullName = getFullName(assignee).trim();
  if (fullName.length > 0) {
    return fullName;
  }

  if (assignee.name?.trim()) {
    return assignee.name.trim();
  }

  return assignee.email?.trim() ?? "";
}

export const inventoryUsageRouter = {
  usageSummary: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.inventoryEvent.findMany({
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
        OR: [
          { type: "CONSUME" },
          {
            type: "ASSIGN",
            returnedAt: null,
          },
        ],
      },
      include: {
        assignee: true,
      },
    });

    const staffs = new Map<string, { name: string; count: number }>();

    events.forEach((event) => {
      if (!event.assignee || !event.assigneeId) {
        return;
      }
      const current = staffs.get(event.assigneeId) ?? {
        name: getAssigneeDisplayName(event.assignee),
        count: 0,
      };

      if (event.type === "CONSUME") {
        current.count += event.quantity;
      } else {
        current.count += 1;
      }

      staffs.set(event.assigneeId, current);
    });

    return Array.from(staffs.entries())
      .map(([staffId, info]) => ({
        staffId,
        name: info.name,
        count: info.count,
      }))
      .sort((a, b) => b.count - a.count);
  }),

  stockLevelSummary: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.inventoryItem.findMany({
      where: {
        schoolId: ctx.schoolId,
        trackingType: "CONSUMABLE",
        isActive: true,
      },
      include: {
        unit: true,
        events: {
          where: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
            type: {
              in: ["STOCK_IN", "CONSUME", "ADJUST"],
            },
          },
          select: {
            type: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return items.map((item) => {
      const currentStock = computeConsumableStock(item.events);
      const totalUsage = item.events
        .filter((event) => event.type === "CONSUME")
        .reduce((acc, event) => acc + event.quantity, 0);

      return {
        id: item.id,
        name: item.name,
        unitName: item.unit?.name ?? "",
        currentStock,
        minStockLevel: item.minStockLevel ?? 0,
        totalUsage,
      };
    });
  }),

  monthlySummary: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const monthStarts = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
      );
      return d;
    });
    monthStarts.reverse();

    const startDate =
      monthStarts[0] ??
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const events = await ctx.db.inventoryEvent.findMany({
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        quantity: true,
        type: true,
        returnedAt: true,
      },
    });

    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const summary = new Map<
      string,
      {
        month: string;
        consumableUsage: number;
        stockIn: number;
        stockOut: number;
        assetAssigned: number;
        assetReturned: number;
      }
    >();

    monthStarts.forEach((monthDate) => {
      const key = monthKey(monthDate);
      summary.set(key, {
        month: formatter.format(monthDate),
        consumableUsage: 0,
        stockIn: 0,
        stockOut: 0,
        assetAssigned: 0,
        assetReturned: 0,
      });
    });

    events.forEach((event) => {
      const key = monthKey(event.createdAt);
      const bucket = summary.get(key);
      if (!bucket) {
        return;
      }

      if (event.type === "CONSUME") {
        bucket.consumableUsage += event.quantity;
        bucket.stockOut += event.quantity;
      } else if (event.type === "STOCK_IN") {
        bucket.stockIn += event.quantity;
      } else if (event.type === "ADJUST") {
        if (event.quantity >= 0) {
          bucket.stockIn += event.quantity;
        } else {
          bucket.stockOut += Math.abs(event.quantity);
        }
      } else {
        bucket.assetAssigned += 1;
        if (event.returnedAt) {
          const returnedKey = monthKey(event.returnedAt);
          const returnedBucket = summary.get(returnedKey);
          if (returnedBucket) {
            returnedBucket.assetReturned += 1;
          }
        }
      }
    });

    return monthStarts.map((monthDate) => {
      const key = monthKey(monthDate);
      return (
        summary.get(key) ?? {
          month: formatter.format(monthDate),
          consumableUsage: 0,
          stockIn: 0,
          stockOut: 0,
          assetAssigned: 0,
          assetReturned: 0,
        }
      );
    });
  }),

  statusOverview: protectedProcedure.query(async ({ ctx }) => {
    const [returnableItems, consumables] = await Promise.all([
      ctx.db.inventoryItem.findMany({
        where: {
          schoolId: ctx.schoolId,
          trackingType: "RETURNABLE",
          isActive: true,
        },
        include: {
          events: {
            where: {
              schoolId: ctx.schoolId,
              type: "ASSIGN",
              returnedAt: null,
            },
            select: {
              id: true,
            },
          },
        },
      }),
      ctx.db.inventoryItem.findMany({
        where: {
          schoolId: ctx.schoolId,
          trackingType: "CONSUMABLE",
          isActive: true,
        },
        include: {
          events: {
            where: {
              schoolId: ctx.schoolId,
              schoolYearId: ctx.schoolYearId,
              type: {
                in: ["STOCK_IN", "CONSUME", "ADJUST"],
              },
            },
            select: {
              type: true,
              quantity: true,
            },
          },
        },
      }),
    ]);

    const assetsInUse = returnableItems.filter(
      (item) => item.events.length > 0,
    ).length;
    const assetsAvailable = Math.max(returnableItems.length - assetsInUse, 0);

    const lowStock = consumables.filter((item) => {
      const currentStock = computeConsumableStock(item.events);
      const minStockLevel = item.minStockLevel ?? 0;
      return (
        minStockLevel > 0 && currentStock > 0 && currentStock <= minStockLevel
      );
    }).length;

    const outOfStock = consumables.filter((item) => {
      const currentStock = computeConsumableStock(item.events);
      return currentStock <= 0;
    }).length;

    return {
      assetsAvailable,
      assetsInUse,
      lowStock,
      outOfStock,
    };
  }),
} satisfies TRPCRouterRecord;
