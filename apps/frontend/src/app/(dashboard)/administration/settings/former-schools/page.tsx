import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { FormerSchoolHeader } from "./FormerSchoolHeader";
import { SchoolDataTable } from "./SchoolDataTable";

export default function Page() {
  prefetch(trpc.formerSchool.all.queryOptions());
  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<Skeleton className="h-8" />}>
          <FormerSchoolHeader />
        </Suspense>
        <div className="px-4">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton className="h-8" key={index} />
                  ))}
                </div>
              }
            >
              <SchoolDataTable />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </HydrateClient>
  );
}
