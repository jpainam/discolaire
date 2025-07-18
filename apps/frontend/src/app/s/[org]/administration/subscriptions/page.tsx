import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { SubscriptionHeader } from "./SubscriptionHeader";
import { SubscriptionDataTable } from "./SuscriptionDataTable";

export default function Page() {
  batchPrefetch([
    trpc.subscription.all.queryOptions({
      limit: 1000,
    }),
    trpc.subscription.count.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-3 gap-4 py-2 px-4">
              <Skeleton className="h-8 col-span-full" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          }
        >
          <SubscriptionHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 px-4 py-2 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-8 " />
              ))}
            </div>
          }
        >
          <SubscriptionDataTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
