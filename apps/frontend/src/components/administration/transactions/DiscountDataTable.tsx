"use client";

import type { RouterOutputs } from "@repo/api";

import { DataTable, useDataTable } from "~/components/datatable";
import { TransactionDataTableAction } from "./TransactionDataTableAction";
import { useTransactionColumns } from "./TransactionDataTableColumn";

export function DiscountDataTable({
  transactions,
}: {
  transactions: RouterOutputs["transaction"]["all"];
}) {
  const columns = useTransactionColumns();

  const { table } = useDataTable({
    data: transactions,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <TransactionDataTableAction table={table} />
    </DataTable>
  );
}
