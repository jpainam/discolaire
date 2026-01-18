import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ClassroomStudentTable } from "~/components/classrooms/enrollments/ClassroomStudentTable";
import { EnrollmentHeader } from "~/components/classrooms/enrollments/EnrollmentHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  // const canReadClassroom = await checkPermission(
  //   "enrollment",
  //   "read",
  // );
  // if (!canReadClassroom) {
  //   return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  // }

  void batchPrefetch([
    trpc.classroom.get.queryOptions(params.id),
    trpc.classroom.students.queryOptions(params.id),
    trpc.classroom.students.queryOptions(params.id),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8 w-full" />
            </div>
          }
        >
          <EnrollmentHeader className="border-y" />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          }
        >
          <ClassroomStudentTable classroomId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
