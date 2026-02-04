import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { NotificationOverview } from "~/components/notifications/NotificationOverview";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { HydrateClient } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contactId = params.id;
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<TableSkeleton rows={10} cols={8} />}>
          <NotificationOverview
            recipientId={contactId}
            recipientProfile="contact"
          />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
