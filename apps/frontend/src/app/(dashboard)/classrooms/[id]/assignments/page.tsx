import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { AssignmentHeader } from "~/components/classrooms/assignments/AssignmentHeader";
import { ClassroomAssignmentList } from "~/components/classrooms/assignments/ClassroomAssignmentList";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  batchPrefetch([
    trpc.assignment.all.queryOptions({
      classroomId: params.id,
    }),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-8 w-full" />}>
          <AssignmentHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-3 p-4">
              {Array.from({ length: 6 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          }
        >
          <ClassroomAssignmentList classroomId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
