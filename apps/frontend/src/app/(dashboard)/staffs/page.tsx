import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { StaffDataTable } from "~/components/staffs/StaffDataTable";
import { StaffHeader } from "~/components/staffs/StaffHeader";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default function Page() {
  prefetch(trpc.staff.all.queryOptions());
  return (
    <HydrateClient>
      <div className="flex flex-col">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="px-4 py-2">
                <Skeleton className="h-8 w-full" />
              </div>
            }
          >
            <StaffHeader />
          </Suspense>
        </ErrorBoundary>

        <Separator />

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 px-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            }
          >
            <StaffDataTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
