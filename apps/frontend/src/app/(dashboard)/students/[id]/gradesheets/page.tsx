import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { GradeSheetTable } from "~/components/students/grades/gradesheets/StudentGradesheetTable";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  prefetch(trpc.student.grades.queryOptions({ id }));

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={id}
          fallback={
            <div className="grid grid-cols-4 p-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton className="h-8" key={i} />
              ))}
            </div>
          }
        >
          <GradeSheetTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
