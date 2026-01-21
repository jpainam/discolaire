import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { UserRoleHeader } from "./UserRoleHeader";
import { UserRoleTable } from "./UserRoleTable";

export default function Page() {
  batchPrefetch([trpc.role.all.queryOptions()]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <UserRoleHeader />
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<TableSkeleton rows={10} cols={5} />}>
          <UserRoleTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
