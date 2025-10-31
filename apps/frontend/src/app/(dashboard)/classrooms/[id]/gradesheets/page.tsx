import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { GradeSheetDataTable } from "~/components/classrooms/gradesheets/GradeSheetDataTable";
import { GradeSheetHeader } from "~/components/classrooms/gradesheets/GradeSheetHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ term: number; subject: number }>;
}) {
  //const searchParams = await props.searchParams;

  //const { term, subject } = searchParams;

  const params = await props.params;

  const { id } = params;

  prefetch(trpc.classroom.gradesheets.queryOptions(id));

  return (
    <div className="flex w-full flex-col gap-2">
      <GradeSheetHeader />
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={id}
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
    </div>
  );
}
