import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { AccountingJournalHeader } from "./AccountingJournalHeader";
import { AccountingJournalTable } from "./AccountingJournalTable";

export function AccountingJournal() {
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
                <div key={index} className="grid grid-cols-3 gap-4 px-4 py-2">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
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
