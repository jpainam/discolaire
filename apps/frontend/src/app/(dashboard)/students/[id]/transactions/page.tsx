//import FinanceHeader from "~/components/students/transactions/FinanceHeader";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { TransactionStats } from "~/components/students/transactions/transaction-stats";
import { TransactionTable } from "~/components/students/transactions/TransactionTable";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(trpc.student.transactions.queryOptions(params.id));

  await caller.logActivity.create({
    title: "Student transactions",
    type: "READ",
    url: `/students/${params.id}/transactions`,
    entityId: params.id,
    entityType: "student",
  });

  return (
    <HydrateClient>
      <div className="flex w-full flex-col gap-2">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 px-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            }
          >
            <TransactionStats studentId={params.id} />
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
