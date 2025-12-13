import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { GradeSheetDataTable } from "~/components/classrooms/gradesheets/GradeSheetDataTable";
import { GradeSheetHeader } from "~/components/classrooms/gradesheets/GradeSheetHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ term: number; subject: number }>;
}) {
  const params = await props.params;

  batchPrefetch([
    trpc.classroom.gradesheets.queryOptions(params.id),
    trpc.classroom.get.queryOptions(params.id),
    trpc.classroom.students.queryOptions(params.id),
  ]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-8 w-full" />}>
          <GradeSheetHeader />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <GradeSheetDataTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
