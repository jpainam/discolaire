//import FinanceHeader from "~/components/students/transactions/FinanceHeader";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { StudentTransactionSummary } from "~/components/students/transactions/StudentTransactionSummary";
import { TransactionTable } from "~/components/students/transactions/TransactionTable";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(trpc.student.transactions.queryOptions(params.id));

  return (
    <HydrateClient>
      <div className="flex w-full flex-col gap-2">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 px-4 py-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            }
          >
            {/* <TransactionStats studentId={params.id} /> */}
            <StudentTransactionSummary studentId={params.id} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 px-4">
                {Array.from({ length: 16 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            }
          >
            <TransactionTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
