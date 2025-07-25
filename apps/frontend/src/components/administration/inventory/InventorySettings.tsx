import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { InventoryStockUnitTable } from "./InventoryStockUnitTable";

export function InventorySettings() {
  batchPrefetch([trpc.inventory.units.queryOptions()]);

  return (
    <HydrateClient>
      <div className="grid gap-4 px-4 lg:grid-cols-3">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            }
          >
            <InventoryStockUnitTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
