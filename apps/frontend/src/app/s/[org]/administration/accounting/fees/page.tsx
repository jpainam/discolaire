import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { FeeBar } from "~/components/administration/fees/charts/FeeBar";
import { FeeTrend } from "~/components/administration/fees/charts/FeeTrend";
import { FeeDataTable } from "~/components/administration/fees/FeeDataTable";
import { FeeHeader } from "~/components/administration/fees/FeeHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default function Page() {
  batchPrefetch([
    trpc.fee.monthly.queryOptions(),
    trpc.fee.trend.queryOptions(),
    trpc.fee.all.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <FeeHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid gap-4 px-4 md:grid-cols-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <FeeDataTable />
        </Suspense>
      </ErrorBoundary>
      <div className="flex flex-row gap-2">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-[200px] w-[350px] p-2" />}>
            <FeeBar />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-[200px] w-[350px] p-2" />}>
            <FeeTrend />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
