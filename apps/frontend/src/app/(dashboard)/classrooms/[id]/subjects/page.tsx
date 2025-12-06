import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ClassroomSubjectHeader } from "~/components/classrooms/subjects/ClassroomSubjectHeader";
import { ClassroomSubjectTable } from "~/components/classrooms/subjects/ClassroomSubjectTable";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  // const canReadClassroomSubject = await checkPermission(
  //   "subject",
  //   PermissionAction.READ,
  // );
  // if (!canReadClassroomSubject) {
  //   return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  // }

  batchPrefetch([
    trpc.classroom.subjects.queryOptions(id),
    trpc.subject.gradesheetCount.queryOptions({ classroomId: id }),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <ClassroomSubjectHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 px-4 py-2">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={`subject-table-${index}`} className="h-8" />
              ))}
            </div>
          }
        >
          <ClassroomSubjectTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
