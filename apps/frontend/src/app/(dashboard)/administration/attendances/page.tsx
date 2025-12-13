import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { AttendanceChart } from "./AttendanceChart";
import { AttendanceDataTable } from "./AttendanceDataTable";
import { AttendanceStats } from "./AttendanceStats";

export default function Page() {
  batchPrefetch([
    trpc.attendance.all.queryOptions({}),
    trpc.attendance.chart.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <div className="flex flex-col gap-4 px-4">
        <AttendanceStats />
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="gap2 grid grid-cols-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            }
          >
            <AttendanceChart />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => {
                  return <Skeleton key={index} className="h-8" />;
                })}
              </div>
            }
          >
            <AttendanceDataTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
