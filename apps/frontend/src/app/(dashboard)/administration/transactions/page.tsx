import { Separator } from "@repo/ui/separator";

import { TransactionDataTable } from "~/components/administration/transactions/TransactionDataTable";
import { TransactionSummary } from "~/components/administration/transactions/TransactionSummary";

export default function AdminTransaction() {
  return (
    <>
      <TransactionSummary />
      <Separator />
      <TransactionDataTable />
    </>
  );
}
