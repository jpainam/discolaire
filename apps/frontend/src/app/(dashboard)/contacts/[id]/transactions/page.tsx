import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ContactTransactionSummary } from "~/components/contacts/transactions/ContactTransactionSummary";
import { ContactTransactionTable } from "~/components/contacts/transactions/ContactTransactionTable";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contactId = params.id;

  batchPrefetch([trpc.contact.transactions.queryOptions(contactId)]);

  return (
    <HydrateClient>
      <div className="flex flex-col gap-2 px-4 py-2">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            }
          >
            <ContactTransactionSummary contactId={contactId} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 16 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            }
          >
            <ContactTransactionTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
