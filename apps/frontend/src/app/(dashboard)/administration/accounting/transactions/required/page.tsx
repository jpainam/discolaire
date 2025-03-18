import { RequiredFeeClassrooms } from "~/components/administration/transactions/charts/RequiredFeeClassrooms";
import { RequiredFeeTransactionTrend } from "~/components/administration/transactions/charts/RequiredFeeTransactionTrend";
import { RequiredFeeDataTable } from "~/components/administration/transactions/RequiredFeeDataTable";
import { RequiredFeeHeader } from "~/components/administration/transactions/RequiredFeeHeader";

export default async function Page(props: {
  searchParams: Promise<{
    classroom: string;
    from: string;
    status: string;
    to: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams);
  //const transactions = await api.transaction.required({});
  return (
    <div className="flex flex-col ">
      <RequiredFeeHeader />
      <RequiredFeeDataTable />
      <RequiredFeeTransactionTrend />
      <RequiredFeeClassrooms />
    </div>
  );
}
