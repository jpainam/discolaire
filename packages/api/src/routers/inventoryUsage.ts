import { getAllAssets, getAllConsumables } from "../services/inventory-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const inventoryUsageRouter = createTRPCRouter({
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
});
