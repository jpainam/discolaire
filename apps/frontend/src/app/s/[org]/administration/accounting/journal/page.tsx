import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { AccountingJournalHeader } from "./AccountingJournalHeader";
import { AccountingJournalTable } from "./AccountingJournalTable";

export default function Page() {
  batchPrefetch([
    trpc.accountingJournal.all.queryOptions(),
    trpc.accountingJournal.stats.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <AccountingJournalHeader />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div>
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="grid grid-cols-3 gap-4 px-4 py-2">
                  <Skeleton key={index} className="h-10" />
                  <Skeleton key={index} className="h-10" />
                  <Skeleton key={index} className="h-10" />
                </div>
              ))}
            </div>
          }
        >
          <AccountingJournalTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
