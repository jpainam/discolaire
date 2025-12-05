import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { SubjectGradeDistribution } from "~/components/classrooms/subjects/SubjectGradeDistribution";
import { SubjectGradeTable } from "~/components/classrooms/subjects/SubjectGradeTable";
import { SubjectHeader } from "~/components/classrooms/subjects/SubjectHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ subjectId: number }>;
}) {
  const params = await props.params;
  batchPrefetch([
    trpc.subject.get.queryOptions(params.subjectId),
    trpc.subject.grades.queryOptions(params.subjectId),
    trpc.term.all.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-10" />}>
          <SubjectHeader />
        </Suspense>
      </ErrorBoundary>
      <div className="grid grid-cols-2 gap-4">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense>
            <SubjectGradeDistribution />
          </Suspense>
        </ErrorBoundary>
      </div>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <SubjectGradeTable subjectId={params.subjectId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
