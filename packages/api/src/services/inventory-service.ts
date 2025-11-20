import type { PrismaClient } from "@repo/db";

export class InventoryService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }
  async getAllAssets({
    schoolId,
    schoolYearId,
  }: {
    schoolId: string;
    schoolYearId: string;
  }) {
    const assets = await this.db.inventoryAsset.findMany({
      where: {
        schoolId: schoolId,
        // usages: {
        //   some: {
        //     schoolYearId: schoolYearId,
        //   },
        // },
      },
      include: {
        usages: {
          include: {
            user: true,
          },
        },
      },
    });

    const items: {
      id: string;
      type: "ASSET" | "CONSUMABLE";
      name: string;
      note: string | null;
      schoolId: string;
      schoolYearId: string;
      users: { image?: string; name: string }[];
      other: Record<string, string | null>;
    }[] = [];
    assets.forEach((asset) => {
      items.push({
        id: asset.id,
        type: "ASSET",
        schoolId: asset.schoolId,
        schoolYearId: schoolYearId,
        name: asset.name,
        users: asset.usages.map((u) => {
          return {
            image: u.user.avatar ?? "",
            name: u.user.name,
          };
        }),
        note: asset.note ? asset.note.replace(/(\r\n|\n|\r)/g, ",") : null,
        other: {
          sku: asset.sku,
          serial: asset.serial,
        },
      });
    });
    return items;
  }
  async getAllConsumables({
    schoolId,
    schoolYearId,
  }: {
    schoolId: string;
    schoolYearId: string;
  }) {
    const consumables = await this.db.inventoryConsumable.findMany({
      include: {
        unit: true,
        usages: {
          include: {
            user: true,
          },
        },
      },
      where: {
        schoolId: schoolId,
        schoolYearId: schoolYearId,
      },
    });
    const items: {
      id: string;
      type: "ASSET" | "CONSUMABLE";
      name: string;
      note: string | null;
      schoolId: string;
      schoolYearId: string;
      users: { image?: string; name: string }[];
      other: Record<string, string | null>;
    }[] = [];

    consumables.forEach((consumable) => {
      items.push({
        id: consumable.id,
        type: "CONSUMABLE",
        name: consumable.name,
        note: consumable.note
          ? consumable.note.replace(/(\r\n|\n|\r)/g, ",")
          : null,
        schoolId: consumable.schoolId,
        schoolYearId: consumable.schoolYearId,
        users: consumable.usages.map((u) => {
          return {
            name: u.user.name,
            image: u.user.avatar ?? "",
          };
        }),
        other: {
          currentStock: consumable.currentStock.toString(),
          minLevelStock: consumable.minStockLevel.toString(),
          unitId: consumable.unitId,
          unitName: consumable.unit.name,
        },
      });
    });
    return items;
  }
  async syncStockQuantity({
    schoolId,
    schoolYearId,
    consumableId,
  }: {
    schoolId: string;
    schoolYearId: string;
    consumableId: string;
  }) {
    const allMovements = await this.db.inventoryStockMovement.findMany({
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

    const usages = await this.db.inventoryConsumableUsage.findMany({
      where: {
        consumableId: consumableId,
        schoolId: schoolId,
        schoolYearId: schoolYearId,
      },
    });
    const usageStock = usages.reduce((acc, usage) => {
      return acc + usage.quantity;
    }, 0);
    await this.db.inventoryConsumable.update({
      where: {
        id: consumableId,
      },
      data: {
        currentStock: currentStock - usageStock,
      },
    });
  }
}
