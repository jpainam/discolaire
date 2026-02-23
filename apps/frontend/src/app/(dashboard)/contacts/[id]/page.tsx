import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ContactNotificationSummary } from "./ContactNotificationSummary";
import { ContactRecentTransactions } from "./ContactRecentTransactions";
import { ContactStudentOverview } from "./ContactStudentOverview";
import { StatCards } from "./StatCards";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const contactId = params.id;

  batchPrefetch([
    trpc.contact.students.queryOptions(contactId),
    trpc.contact.transactions.queryOptions(contactId),
    trpc.contact.studentOverview.queryOptions(contactId),
    trpc.contact.stats.queryOptions(contactId),
  ]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid gap-4 p-4 xl:grid-cols-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          }
        >
          <StatCards contactId={contactId} />
        </Suspense>
      </ErrorBoundary>
      <div className="grid gap-4 px-4 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-2">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <ContactStudentOverview contactId={contactId} />
          </ErrorBoundary>
          <ContactNotificationSummary contactId={contactId} />
        </div>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-50" />}>
            <ContactRecentTransactions contactId={contactId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
