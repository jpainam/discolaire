import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ClassroomFinancialSituation } from "../../../../../components/classrooms/finances/ClassroomFinancialSituation";
import { ClassroomFinancialSituationHeader } from "../../../../../components/classrooms/finances/ClassroomFinancialSituationHeader";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([
    trpc.classroom.fees.queryOptions(params.id),
    trpc.accountingJournal.all.queryOptions(),
    trpc.classroom.studentsBalance.queryOptions(params.id),
  ]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-10" />}>
          <ClassroomFinancialSituationHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 p-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-40" />
              ))}
            </div>
          }
        >
          <ClassroomFinancialSituation />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
