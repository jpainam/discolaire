import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { HealthHistory } from "~/components/students/health/HealthHistory";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(trpc.health.issues.queryOptions(params.id));
  return (
    <HydrateClient>
      <div className="p-4">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={params.id}
            fallback={
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            }
          >
            <HealthHistory studentId={params.id} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
