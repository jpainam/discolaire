import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ClassroomFinancialSituation } from "~/components/classrooms/finances/ClassroomFinancialSituation";
import { ClassroomFinancialSituationHeader } from "~/components/classrooms/finances/ClassroomFinancialSituationHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([
    trpc.classroom.fees.queryOptions(params.id),
    trpc.accountingJournal.all.queryOptions(),
    trpc.classroom.studentsBalance.queryOptions(params.id),
  ]);

  return (
    <HydrateClient>
      <div className="flex flex-col gap-2">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-8" />}>
            <ClassroomFinancialSituationHeader />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="space-y-4 p-4">
                <Skeleton className="h-10 w-full md:w-96" />
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-12" />
                ))}
              </div>
            }
          >
            <ClassroomFinancialSituation />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
