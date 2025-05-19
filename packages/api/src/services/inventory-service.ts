import { db } from "@repo/db";

export async function getAllAssets({
  schoolId,
  schoolYearId,
}: {
  schoolId: string;
  schoolYearId: string;
}) {
  const assignedAssets = await db.inventoryAssetAssignment.findMany({
    include: {
      user: true,
    },
    where: {
      asset: {
        schoolId: schoolId,
        schoolYearId: schoolYearId,
      },
    },
  });

  const assets = await db.inventoryAsset.findMany({
    where: {
      schoolId: schoolId,
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
      schoolYearId: asset.schoolYearId,
      name: asset.name,
      users: assignedAssets
        .filter((v) => (v.assetId = asset.id))
        .map((assignment) => {
          return {
            image: assignment.user.avatar ?? "",
            name: assignment.user.name ?? "",
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
  const usages = await db.inventoryConsumableUsage.findMany({
    include: {
      user: true,
    },
    where: {
      consumable: {
        schoolId: schoolId,
        schoolYearId: schoolYearId,
      },
    },
  });

  const consumables = await db.inventoryConsumable.findMany({
    include: {
      unit: true,
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
      users: usages
        .filter((v) => (v.consumableId = consumable.id))
        .map((usage) => {
          return {
            image: usage.user.avatar ?? "",
            name: usage.user.name ?? "",
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
