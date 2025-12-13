import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ClassroomTimetable } from "./ClassroomTimetable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  batchPrefetch([
    trpc.subjectTimetable.byClassroom.queryOptions({
      classroomId: params.id,
    }),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-20" />
              ))}
            </div>
          }
        >
          <ClassroomTimetable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
