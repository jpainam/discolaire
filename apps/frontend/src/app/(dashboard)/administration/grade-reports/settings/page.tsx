import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { GradeReportSettings } from "./GradeReportSettings";

export default function Page() {
  batchPrefetch([trpc.term.all.queryOptions()]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-48" />}>
          <GradeReportSettings />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
