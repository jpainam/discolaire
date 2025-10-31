import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { GradeReportTrackerDataTable } from "~/components/administration/grade-reports/GradeReportTrackerDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, trpc } from "~/trpc/server";

export default function Page() {
  batchPrefetch([trpc.gradeSheet.gradesReportTracker.queryOptions()]);
  return (
    <ErrorBoundary errorComponent={ErrorFallback}>
      <Suspense
        fallback={
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-48" />
            ))}
          </div>
        }
      >
        <GradeReportTrackerDataTable />
      </Suspense>
    </ErrorBoundary>
  );
}
