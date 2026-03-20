import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ModulePermissionTable } from "./ModulePermissionTable";

export default async function Page(props: {
  params: Promise<{ moduleId: string }>;
}) {
  const params = await props.params;

  batchPrefetch([trpc.module.get.queryOptions(params.moduleId)]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<TableSkeleton rows={6} cols={4} />}>
          <ModulePermissionTable moduleId={params.moduleId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
