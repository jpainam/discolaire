import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default function Page() {
  prefetch(trpc.classroom.all.queryOptions());

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={"classroom-data-table"}
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
      </ErrorBoundary>
    </HydrateClient>
  );
}
