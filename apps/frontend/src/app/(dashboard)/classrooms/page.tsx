import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ClassroomTable } from "~/components/classrooms/ClassroomTable";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default function Page() {
  batchPrefetch([
    trpc.classroom.all.queryOptions(),
    trpc.classroom.all.queryOptions(),
    trpc.classroomCycle.all.queryOptions(),
    trpc.classroomLevel.all.queryOptions(),
    trpc.classroomSection.all.queryOptions(),
  ]);

  return (
    <HydrateClient>
     
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <ClassroomTable />
        </Suspense>
      </ErrorBoundary>
      {/* <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <ClassroomDataTable />
        </Suspense>
      </ErrorBoundary> */}
    </HydrateClient>
  );
}
