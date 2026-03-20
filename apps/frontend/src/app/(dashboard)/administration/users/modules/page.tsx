import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ModuleHeader } from "./ModuleHeader";
import { ModuleTable } from "./ModuleTable";

export default function Page() {
  batchPrefetch([trpc.module.all.queryOptions()]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <ModuleHeader />
        </Suspense>
      </ErrorBoundary>
      <Suspense>
        <ModuleTable />
      </Suspense>
    </HydrateClient>
  );
}
