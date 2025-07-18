import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";

import { StaffDataTable } from "~/components/staffs/StaffDataTable";
import { StaffHeader } from "~/components/staffs/StaffHeader";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default function Page() {
  prefetch(trpc.staff.all.queryOptions());
  return (
    <HydrateClient>
      <div className="flex flex-col">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="py-2 px-4">
                <Skeleton className="h-8 w-full" />
              </div>
            }
          >
            <StaffHeader />
          </Suspense>
        </ErrorBoundary>

        <Separator />
        <div className="mt-2 flex-1 px-4">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4">
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
      </div>
    </HydrateClient>
  );
}
