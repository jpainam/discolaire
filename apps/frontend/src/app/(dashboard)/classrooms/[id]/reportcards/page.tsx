import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ReportCardTermContainer } from "./ReportCardTermContainer";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([
    trpc.classroom.get.queryOptions(params.id),
    trpc.classroom.subjects.queryOptions(params.id),
    trpc.classroom.students.queryOptions(params.id),
  ]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 8 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          }
        >
          <ReportCardTermContainer />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
