import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { NotificationOverview } from "~/components/notifications/NotificationOverview";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const studentId = params.id;
  batchPrefetch([
    trpc.notification.stats.queryOptions({
      recipientId: studentId,
      recipientProfile: "student",
    }),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<TableSkeleton rows={10} cols={8} />}>
          <NotificationOverview
            recipientId={studentId}
            recipientProfile="student"
          />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
