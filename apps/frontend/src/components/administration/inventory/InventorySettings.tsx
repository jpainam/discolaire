import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export function InventorySettings() {
  batchPrefetch([trpc.inventory.units.queryOptions()]);

  return (
    <HydrateClient>
      <div className="grid lg:grid-cols-3 gap-4">
        <InventoryStockUnitTable />
      </div>
    </HydrateClient>
  );
}
