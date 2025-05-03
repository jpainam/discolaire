import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ClassroomTimetable } from "./ClassroomTimetable";
export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode: "day" | "week" | "month" | null | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  console.log(searchParams);

  // const mode = searchParams.mode ?? "week";
  batchPrefetch([
    trpc.lesson.byClassroom.queryOptions({
      classroomId: params.id,
    }),
    trpc.classroom.teachers.queryOptions(params.id),
  ]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid gap-4 p-4">
              <Skeleton className="h-12" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 16 }).map((_, index) => (
                  <Skeleton key={index} className="h-12" />
                ))}
              </div>
            </div>
          }
        >
          <ClassroomTimetable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
