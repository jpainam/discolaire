import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { TransactionDataTable } from "~/components/administration/transactions/TransactionDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { TransactionHeader } from "./TransactionHeader";

export default async function Page(props: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    status?: string;
    classroom?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  prefetch(
    trpc.transaction.all.queryOptions({
      status: searchParams.status,
      from: searchParams.from ? new Date(searchParams.from) : undefined,
      to: searchParams.to ? new Date(searchParams.to) : undefined,
      classroomId: searchParams.classroom,
    }),
  );

  return (
    <div className="flex flex-col px-4">
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="py-2 px-4">
                <Skeleton className="h-8 w-1/2" />
              </div>
            }
          >
            <TransactionHeader />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 ">
                {Array.from({ length: 16 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            }
          >
            <TransactionDataTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
