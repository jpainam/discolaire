import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { EnrollmentDataTable } from "~/components/classrooms/enrollments/EnrollmentDataTable";
import { EnrollmentHeader } from "~/components/classrooms/enrollments/EnrollmentHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  // const canReadClassroom = await checkPermission(
  //   "enrollment",
  //   PermissionAction.READ,
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
          <EnrollmentHeader />
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
          <div className="px-4 py-2">
            <EnrollmentDataTable />
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
