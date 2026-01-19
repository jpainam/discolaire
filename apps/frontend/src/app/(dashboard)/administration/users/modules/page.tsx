import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient } from "~/trpc/server";
import { ModuleDataTableV2 } from "./ModuleDataTableV2";
import { ModuleHeader } from "./ModuleHeader";

export default function Page() {
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <ModuleHeader />
        </Suspense>
      </ErrorBoundary>
      <Suspense>
        <ModuleDataTableV2 />
      </Suspense>
    </HydrateClient>
  );
}
