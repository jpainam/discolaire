import { db } from "@repo/db";

export function getInventoryAssets() {
  //   return db.inventoryItem.findMany({
  //     where: {
  //       category: {
  //         type: "ASSET",
  //       },
  //     },
  //     include: {
  //       _count: {
  //         select: { assets: true },
  //       },
  //     },
  //   });
}

export function getConsumableItems() {
  return db.inventoryItem.findMany({
    where: {
      category: {
        type: "CONSUMABLE",
      },
    },
    include: {
      _count: {
        select: { consumables: true },
      },
    },
  });
}
