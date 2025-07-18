import { TransactionClassrooms } from "~/components/administration/transactions/charts/TransactionClassrooms";
import { TransactionTrendChart } from "~/components/administration/transactions/charts/TransactionTrendChart";
import { TransactionTotals } from "~/components/administration/transactions/TransactionTotals";

export default function Page() {
  return (
    <div className="flex flex-col px-4 gap-4 mb-8">
      <TransactionTotals />
      {/* <Separator /> */}
      <TransactionTrendChart />
      {/* <Separator /> */}
      <TransactionClassrooms />
    </div>
  );
}
