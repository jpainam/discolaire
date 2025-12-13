import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { InventoryMonthlyUsage } from "~/components/administration/inventory/InventoryMontlyUsage";
import { InventoryStockLevelSummary } from "~/components/administration/inventory/InventoryStockLevelSummary";
import { InventorySummary2 } from "~/components/administration/inventory/InventorySummary2";
import { InventoryUserUsage } from "~/components/administration/inventory/InventoryUserUsage";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export function InventorySummary() {
  batchPrefetch([
    trpc.inventoryUsage.usageSummary.queryOptions(),
    trpc.inventoryUsage.stockLevelSummary.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-7">
        <InventoryMonthlyUsage className="col-span-full" />
        <InventoryStockLevelSummary className="lg:col-span-3" />
        <InventorySummary2 />
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="h-[300px]">
                <Skeleton className="h-[300px]" />
              </div>
            }
          >
            <InventoryUserUsage className="lg:col-span-3" />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
