import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { StudentEnrollmentHeader } from "~/components/students/enrollments/StudentEnrollmentHeader";
import { StudentEnrollmentTable } from "~/components/students/enrollments/StudentEnrollmentTable";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  batchPrefetch([
    trpc.student.get.queryOptions(id),
    trpc.student.enrollments.queryOptions(id),
  ]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <StudentEnrollmentHeader studentId={params.id} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="py-2 px-4">
              <Skeleton className="h-20" />
            </div>
          }
        >
          <StudentEnrollmentTable studentId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
