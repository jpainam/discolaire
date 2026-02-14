import type { PrismaClient } from "@repo/db";

import { getFullName } from "../utils";

export class InventoryService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  private computeConsumableStock(
    events: { type: string; quantity: number }[],
  ): number {
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

  private getAssigneeDisplayName(
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

  async getAllItems({
    schoolId,
    schoolYearId,
  }: {
    schoolId: string;
    schoolYearId: string;
  }) {
    const items = await this.db.inventoryItem.findMany({
      where: {
        schoolId,
        isActive: true,
      },
      include: {
        unit: true,
        events: {
          where: {
            schoolId,
            schoolYearId,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            assignee: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return items.map((item) => {
      if (item.trackingType === "RETURNABLE") {
        const assignments = item.events.filter(
          (event) => event.type === "ASSIGN",
        );
        const activeAssignment = assignments.find(
          (event) => event.returnedAt === null,
        );
        const activeAssigneeName = activeAssignment?.assignee
          ? this.getAssigneeDisplayName(activeAssignment.assignee)
          : null;

        return {
          id: item.id,
          type: "ASSET" as const,
          schoolId: item.schoolId,
          schoolYearId,
          name: item.name,
          note: item.note ? item.note.replace(/(\r\n|\n|\r)/g, ",") : null,
          users: activeAssignment?.assignee
            ? [{ name: activeAssigneeName ?? "", image: "" }]
            : assignments
                .filter((event) => event.assignee)
                .map((event) => ({
                  name: this.getAssigneeDisplayName(event.assignee),
                  image: "",
                })),
          other: {
            sku: item.sku,
            serial: item.serial,
            activeUsageId: activeAssignment?.id ?? null,
            activeUserId: activeAssignment?.assigneeId ?? null,
            activeUserName: activeAssigneeName,
            activeStatus: activeAssignment ? "ASSIGNED" : "AVAILABLE",
            dueAt: activeAssignment?.dueAt?.toISOString() ?? null,
            defaultReturnDate: item.defaultReturnDate?.toISOString() ?? null,
          },
        };
      }

      const stockEvents = item.events.filter((event) => {
        return (
          event.type === "STOCK_IN" ||
          event.type === "CONSUME" ||
          event.type === "ADJUST"
        );
      });
      const currentStock = this.computeConsumableStock(stockEvents);
      const users = item.events
        .filter((event) => event.type === "CONSUME" && event.assignee)
        .map((event) => ({
          name: this.getAssigneeDisplayName(event.assignee),
          image: "",
        }));

      return {
        id: item.id,
        type: "CONSUMABLE" as const,
        schoolId: item.schoolId,
        schoolYearId,
        name: item.name,
        note: item.note ? item.note.replace(/(\r\n|\n|\r)/g, ",") : null,
        users,
        other: {
          currentStock: currentStock.toString(),
          minStockLevel: (item.minStockLevel ?? 0).toString(),
          unitId: item.unitId,
          unitName: item.unit?.name ?? null,
        },
      };
    });
  }

  async getConsumables({
    schoolId,
    schoolYearId,
  }: {
    schoolId: string;
    schoolYearId: string;
  }) {
    const items = await this.db.inventoryItem.findMany({
      where: {
        schoolId,
        trackingType: "CONSUMABLE",
        isActive: true,
      },
      include: {
        unit: true,
        events: {
          where: {
            schoolId,
            schoolYearId,
            type: {
              in: ["STOCK_IN", "CONSUME", "ADJUST"],
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return items.map((item) => {
      const currentStock = this.computeConsumableStock(item.events);
      return {
        id: item.id,
        name: item.name,
        note: item.note,
        unitId: item.unitId,
        unit: item.unit,
        currentStock,
        minStockLevel: item.minStockLevel ?? 0,
        schoolId: item.schoolId,
        schoolYearId,
      };
    });
  }

  async getConsumableStock({
    itemId,
    schoolId,
    schoolYearId,
  }: {
    itemId: string;
    schoolId: string;
    schoolYearId: string;
  }) {
    const events = await this.db.inventoryEvent.findMany({
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

    return this.computeConsumableStock(events);
  }
}
