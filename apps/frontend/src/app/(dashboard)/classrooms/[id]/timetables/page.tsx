import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ClassroomTimetablesCalendar } from "./ClassroomTimetablesCalendar";
import { ClassroomTimetablesHeader } from "./ClassroomTimetablesHeader";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ subjectId?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const parsedSubjectId = Number(searchParams.subjectId);
  const initialSubjectId = Number.isFinite(parsedSubjectId)
    ? parsedSubjectId
    : undefined;

  batchPrefetch([
    trpc.classroom.timetables.queryOptions(params.id),
    trpc.classroom.get.queryOptions(params.id),
  ]);

  return (
    <HydrateClient>
      <div className="flex flex-col">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="mx-4 h-8" />}>
            <ClassroomTimetablesHeader initialSubjectId={initialSubjectId} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="mx-4 h-[700px] w-full" />}>
            <ClassroomTimetablesCalendar
              classroomId={params.id}
              initialSubjectId={initialSubjectId}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
