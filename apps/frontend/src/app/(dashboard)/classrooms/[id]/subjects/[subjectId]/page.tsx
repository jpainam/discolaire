import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { CreatedGradesheetCard } from "~/components/classrooms/gradesheets/CreatedGradesheetCard";
import { SubjectGradeTable } from "~/components/classrooms/subjects/SubjectGradeTable";
import { SubjectHeader } from "~/components/classrooms/subjects/SubjectHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ subjectId: number }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();
  const gradesheets = await queryClient.fetchQuery(
    trpc.subject.gradesheets.queryOptions(Number(params.subjectId)),
  );
  batchPrefetch([
    trpc.subject.get.queryOptions(params.subjectId),
    trpc.subject.grades.queryOptions(params.subjectId),
    trpc.term.all.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <div className="flex flex-col gap-2">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-10" />}>
            <SubjectHeader />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense>
            <div className="grid grid-cols-3 gap-2 px-4">
              {gradesheets.map((gs, index) => (
                <CreatedGradesheetCard
                  termName={gs.term.name}
                  key={index}
                  gradeSheetId={gs.id}
                />
              ))}
            </div>
          </Suspense>
        </ErrorBoundary>
        {/* <div className="grid grid-cols-2 gap-4 px-4">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense>
              <SubjectGradeDistribution />
            </Suspense>
          </ErrorBoundary>
        </div> */}
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense>
            <SubjectGradeTable subjectId={params.subjectId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
