import { TransactionClassrooms } from "~/components/administration/transactions/charts/TransactionClassrooms";
import { TransactionTrendChart } from "~/components/administration/transactions/charts/TransactionTrendChart";
import { TransactionTotals } from "~/components/administration/transactions/TransactionTotals";

export default function Page() {
  return (
    <div className="flex flex-col">
      <TransactionTotals />
      {/* <Separator /> */}
      <TransactionTrendChart />
      {/* <Separator /> */}
      <TransactionClassrooms />
    </div>
  );
}
