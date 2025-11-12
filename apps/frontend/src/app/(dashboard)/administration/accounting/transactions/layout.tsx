import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { TransactionHeader } from "~/components/administration/transactions/TransactionHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { TransactionSummaryPerDay } from "./TransactionSummaryPerDay";

export default function Layout({ children }: PropsWithChildren) {
  batchPrefetch([trpc.accountingJournal.all.queryOptions()]);

  return (
    <HydrateClient>
      <div className="grid lg:grid-cols-[1fr_23rem]">
        <div className="flex flex-col gap-2 px-4 py-2">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-8 w-full" />}>
              <TransactionHeader />
            </Suspense>
          </ErrorBoundary>

          {children}
        </div>
        <TransactionSummaryPerDay />
      </div>
    </HydrateClient>
  );
}
