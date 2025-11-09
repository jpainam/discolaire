"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import { TransactionClassrooms } from "~/components/administration/transactions/charts/TransactionClassrooms";
import { TransactionTrendChart } from "~/components/administration/transactions/charts/TransactionTrendChart";
import { TransactionTotals } from "~/components/administration/transactions/TransactionTotals";
import { useTRPC } from "~/trpc/react";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionTotalTabs() {
  const [searchParams] = useQueryStates(transactionSearchParamsSchema);
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(
    trpc.transaction.stats.queryOptions({
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId,
      journalId: searchParams.journalId,
    }),
  );

  const { data: quotas } = useSuspenseQuery(
    trpc.transaction.quotas.queryOptions(),
  );

  const { data: trends } = useSuspenseQuery(
    trpc.transaction.trends.queryOptions({
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId,
      journalId: searchParams.journalId,
    }),
  );

  return (
    <div className="flex flex-col gap-2">
      <TransactionTotals stats={stats} />
      <TransactionTrendChart trends={trends} />
      <TransactionClassrooms quotas={quotas} />
    </div>
  );
}
