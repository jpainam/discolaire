import { TransactionClassrooms } from "~/components/administration/transactions/charts/TransactionClassrooms";
import { TransactionTrendChart } from "~/components/administration/transactions/charts/TransactionTrendChart";
import { TransactionTotals } from "~/components/administration/transactions/TransactionTotals";

export default function Page() {
  return (
    <div className="mb-8 flex flex-col gap-4 px-4">
      <TransactionTotals />
      {/* <Separator /> */}
      <TransactionTrendChart />
      {/* <Separator /> */}
      <TransactionClassrooms />
    </div>
  );
}
