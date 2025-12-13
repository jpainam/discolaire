import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient } from "~/trpc/server";

export default function Page() {
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-3 gap-3 px-4 py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <div className="text-accent my-8 flex items-center justify-center text-center font-mono">
            {" "}
            En cours d'implementation
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
