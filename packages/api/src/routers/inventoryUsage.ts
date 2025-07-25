import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const inventoryUsageRouter = {
  usageSummary: protectedProcedure.query(async ({ ctx }) => {
    const userConsumables = await ctx.db.inventoryConsumableUsage.findMany({
      include: {
        user: true,
      },
    });
    const userAsset = await ctx.db.inventoryAssetUsage.findMany({
      include: {
        user: true,
      },
    });
    const users: { userId: string; name: string; count: number }[] = [];
    const usersIdToCount = new Map<string, number>();
    const usersIdToName = new Map<string, string>();

    userConsumables.forEach((consumable) => {
      const userId = consumable.userId;
      const newCount = usersIdToCount.get(userId) ?? 0;
      usersIdToCount.set(userId, newCount + 1);
      usersIdToName.set(userId, consumable.user.name);
    });
    userAsset.forEach((asset) => {
      const userId = asset.userId;
      const newCount = usersIdToCount.get(userId) ?? 0;
      usersIdToCount.set(userId, newCount + 1);
      usersIdToName.set(userId, asset.user.name);
    });

    usersIdToCount.forEach((count, userId) => {
      users.push({
        userId,
        name: usersIdToName.get(userId) ?? "",
        count,
      });
    });

    users.sort((a, b) => b.count - a.count);
    return users.map((user) => ({
      name: user.name,
      count: user.count,
      userId: user.userId,
    }));
  }),
  stockLevelSummary: protectedProcedure.query(async ({ ctx }) => {
    const consumables = await ctx.db.inventoryConsumable.findMany({
      include: {
        usages: true,
      },
    });

    return consumables.map((consumable) => {
      const total = consumable.usages.reduce((acc, usage) => {
        return acc + usage.quantity;
      }, 0);
      return {
        ...consumable,
        total,
      };
    });
  }),
} satisfies TRPCRouterRecord;
