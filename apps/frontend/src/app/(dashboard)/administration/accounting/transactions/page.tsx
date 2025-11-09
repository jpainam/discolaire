import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { TransactionDataTable } from "~/components/administration/transactions/TransactionDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { transactionSearchParams } from "~/utils/search-params";
import { DeleteTransactionList } from "./DeleteTransactionList";
import { OldTransactionList } from "./OldTransactionList";
import { TransactionDiscount } from "./TransactionDiscount";
import { TransactionTotalTabs } from "./TransactionTotalTab";

interface PageProps {
  searchParams: Promise<SearchParams>;
}
export default async function Page(props: PageProps) {
  const searchParams = await transactionSearchParams(props.searchParams);
  //const searchParams = await props.searchParams;

  batchPrefetch([
    trpc.transaction.all.queryOptions({
      status: searchParams.status ?? undefined,
      from: searchParams.from ? new Date(searchParams.from) : undefined,
      to: searchParams.to ? new Date(searchParams.to) : undefined,
      classroomId: searchParams.classroomId ?? undefined,
      journalId: searchParams.journalId ?? undefined,
    }),
    trpc.transaction.getLastDaysDailySummary.queryOptions({
      number_of_days: 60,
    }),
    trpc.transaction.quotas.queryOptions(),
    trpc.transaction.trends.queryOptions({
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId,
      journalId: searchParams.journalId,
    }),
    trpc.transaction.stats.queryOptions({
      from: searchParams.from ? new Date(searchParams.from) : null,
      to: searchParams.to ? new Date(searchParams.to) : null,
      classroomId: searchParams.classroomId ?? null,
      journalId: searchParams.journalId ?? null,
    }),
    trpc.transaction.getLastDaysDailySummary.queryOptions({
      number_of_days: 60,
    }),
  ]);
  const t = await getTranslations();
  return (
    <HydrateClient>
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">{t("transactions")}</TabsTrigger>
          <TabsTrigger value="totals">{t("totals")}</TabsTrigger>
          <TabsTrigger value="discounts">{t("discounts")}</TabsTrigger>
          <TabsTrigger value="deleted">{t("deleted")}</TabsTrigger>
          <TabsTrigger value="old_systems">Ancien systems</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
              }
            >
              <TransactionDataTable />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="totals">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-6 gap-4">
                  <Skeleton className="col-span-2 h-20" />
                  <Skeleton className="col-span-4 h-20" />
                  <Skeleton className="col-span-4 h-20" />
                  <Skeleton className="col-span-2 h-20" />
                  <Skeleton className="col-span-full h-20" />
                </div>
              }
            >
              <TransactionTotalTabs />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="discounts">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <Skeleton key={index} className="h-8" />
                  ))}
                </div>
              }
            >
              <TransactionDiscount />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="deleted">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <DeleteTransactionList />
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="old_systems">
          <OldTransactionList />
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
