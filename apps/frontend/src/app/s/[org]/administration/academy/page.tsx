import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ProgramCategoryTable } from "./ProgramCategoryTable";

export default function Page() {
  batchPrefetch([trpc.program.categories.queryOptions()]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProgramCategoryTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
