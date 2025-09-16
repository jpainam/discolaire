import { db } from "../db";

export async function getAllAssets({
  schoolId,
  schoolYearId,
}: {
  schoolId: string;
  schoolYearId: string;
}) {
  const assets = await db.inventoryAsset.findMany({
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

export async function getAllConsumables({
  schoolId,
  schoolYearId,
}: {
  schoolId: string;
  schoolYearId: string;
}) {
  const consumables = await db.inventoryConsumable.findMany({
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
