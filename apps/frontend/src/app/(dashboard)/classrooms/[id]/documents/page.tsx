import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ClassroomDocumentHeader } from "~/components/classrooms/documents/ClassroomDocumentHeader";
import { ClassroomDocumentOverview } from "~/components/classrooms/documents/ClassroomDocumentOverview";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([
    trpc.document.all.queryOptions({
      entityId: params.id,
      entityType: "classroom",
    }),
    trpc.document.stats.queryOptions({
      entityId: params.id,
      entityType: "classroom",
    }),
    trpc.document.activities.queryOptions({
      entityId: params.id,
      entityType: "classroom",
    }),
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
          <ClassroomDocumentHeader classroomId={params.id} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid gap-4 px-4 py-2 md:grid-cols-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          }
        >
          <ClassroomDocumentOverview classroomId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
