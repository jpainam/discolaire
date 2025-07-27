import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { TransactionHeader } from "~/components/administration/transactions/TransactionHeader";
import { TransactionToolbar } from "~/components/administration/transactions/TransactionToolbar";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default function Layout({ children }: PropsWithChildren) {
  batchPrefetch([trpc.accountingJournal.all.queryOptions()]);
  return (
    <HydrateClient>
      <div className="flex flex-col">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="px-4 py-2">
                <Skeleton className="h-8" />
              </div>
            }
          >
            <TransactionHeader />
          </Suspense>
        </ErrorBoundary>
        <div className="px-4">
          <TransactionToolbar />
        </div>
        {children}
      </div>
    </HydrateClient>
  );
}
