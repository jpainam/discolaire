import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { StudentGradesheetHeader } from "./StudentGradesheetHeader";
import { StudentGradesheetTable } from "./StudentGradesheetTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([
    trpc.student.grades.queryOptions({ id: params.id }),
    trpc.student.classroom.queryOptions({ studentId: params.id }),
  ]);

  return (
    <HydrateClient>
      <StudentGradesheetHeader />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 px-4">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          }
        >
          <StudentGradesheetTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
