import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { TransactionClassrooms } from "~/components/administration/transactions/charts/TransactionClassrooms";
import { TransactionTrendChart } from "~/components/administration/transactions/charts/TransactionTrendChart";
import { TransactionTotals } from "~/components/administration/transactions/TransactionTotals";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { transactionSearchParams } from "~/utils/search-params";

interface PageProps {
  searchParams: Promise<SearchParams>;
}
export default async function Page(props: PageProps) {
  const searchParams = await transactionSearchParams(props.searchParams);
  batchPrefetch([
    trpc.transaction.trends.queryOptions({
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId,
      journalId: searchParams.journalId,
    }),
    trpc.transaction.stats.queryOptions({
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId,
      journalId: searchParams.journalId,
    }),
  ]);
  return (
    <HydrateClient>
      <div className="mb-8 flex flex-col gap-2 px-4">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid w-full grid-cols-5 gap-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            }
          >
            <TransactionTotals />
          </Suspense>
        </ErrorBoundary>
        {/* <Separator /> */}
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-[250px] w-full" />}>
            <TransactionTrendChart />
          </Suspense>
        </ErrorBoundary>
        {/* <Separator /> */}
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-[250px] w-full" />}>
            <TransactionClassrooms />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
