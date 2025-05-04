import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient } from "~/trpc/server";
import { RateTable } from "./RateTable";

export default function Page() {
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-3 px-4 py-2 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <RateTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
