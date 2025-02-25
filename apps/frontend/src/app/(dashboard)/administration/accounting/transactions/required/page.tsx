import { Separator } from "@repo/ui/components/separator";

import { RequiredFeeClassrooms } from "~/components/administration/transactions/charts/RequiredFeeClassrooms";
import { RequiredFeeTransactionTrend } from "~/components/administration/transactions/charts/RequiredFeeTransactionTrend";
import { RequiredFeeDataTable } from "~/components/administration/transactions/RequiredFeeDataTable";
import { RequiredFeeHeader } from "~/components/administration/transactions/RequiredFeeHeader";

export default function Page() {
  return (
    <div className="flex flex-col">
      <RequiredFeeHeader />
      <Separator />
      <RequiredFeeDataTable />
      <RequiredFeeTransactionTrend />
      <RequiredFeeClassrooms />
    </div>
  );
}
