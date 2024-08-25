import { TransactionDataTable } from "@/components/administration/transactions/TransactionDataTable";
import { TransactionSummary } from "@/components/administration/transactions/TransactionSummary";
import { Separator } from "@repo/ui/separator";

export default function AdminTransaction() {
  return (
    <>
      <TransactionSummary />
      <Separator />
      <TransactionDataTable />
    </>
  );
}
