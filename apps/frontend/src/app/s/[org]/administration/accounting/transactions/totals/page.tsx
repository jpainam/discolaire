import type { SearchParams } from "nuqs/server";

import { TransactionClassrooms } from "~/components/administration/transactions/charts/TransactionClassrooms";
import { TransactionTrendChart } from "~/components/administration/transactions/charts/TransactionTrendChart";
import { TransactionTotals } from "~/components/administration/transactions/TransactionTotals";
import { batchPrefetch, trpc } from "~/trpc/server";
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
    <div className="mb-8 flex flex-col gap-2 px-4">
      <TransactionTotals />
      {/* <Separator /> */}
      <TransactionTrendChart />
      {/* <Separator /> */}
      <TransactionClassrooms />
    </div>
  );
}
