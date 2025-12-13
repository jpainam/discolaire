"use client";

import type { RouterOutputs } from "@repo/api";

import { DataTable, useDataTable } from "~/components/datatable";
import { useDeletedDataTableColumn } from "./DeletedDataTableColumn";

export function DeletedTransactionDataTable({
  transactions,
}: {
  transactions: RouterOutputs["transaction"]["getDeleted"];
}) {
  const columns = useDeletedDataTableColumn();

  const { table } = useDataTable({
    data: transactions,
    columns: columns,
  });

  return <DataTable table={table}></DataTable>;
}
