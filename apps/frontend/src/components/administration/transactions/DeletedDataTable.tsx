"use client";

import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import {
  DataTableToolbarV2,
  DataTableV2,
  DataTableViewOptionsV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { useDeletedDataTableColumn } from "./DeletedDataTableColumn";

export function DeletedTransactionDataTable({
  transactions,
}: {
  transactions: RouterOutputs["transaction"]["getDeleted"];
}) {
  const t = useTranslations();
  const columns = useDeletedDataTableColumn();

  const { table } = useDataTableV2({
    data: transactions,
    columns,
    columnVisibilityKey: "deleted-transaction-table-v2",
    initialState: {
      columnVisibility: {
        observation: false,
      },
    },
  });

  return (
    <DataTableV2
      table={table}
      toolbar={
        <DataTableToolbarV2
          table={table}
          searchPlaceholder={t("search")}
          rightActions={<DataTableViewOptionsV2 table={table} />}
        />
      }
    />
  );
}
