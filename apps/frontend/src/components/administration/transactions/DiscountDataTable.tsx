"use client";

import type { RouterOutputs } from "@repo/api";
import { useTranslations } from "next-intl";

import {
  DataTableToolbarV2,
  DataTableV2,
  DataTableViewOptionsV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { TransactionDataTableAction } from "./TransactionDataTableAction";
import { useTransactionColumns } from "./TransactionDataTableColumn";

type TransactionRow = RouterOutputs["transaction"]["list"]["data"][number];

export function DiscountDataTable({
  transactions,
}: {
  transactions: RouterOutputs["transaction"]["all"];
}) {
  const t = useTranslations();
  const columns = useTransactionColumns();

  const { table } = useDataTableV2({
    data: transactions as TransactionRow[],
    columns,
    columnVisibilityKey: "discount-table-v2",
    initialState: {
      columnVisibility: {
        transactionType: false,
        observation: false,
        receivedBy: false,
        receivedAt: false,
        updatedBy: false,
        method: false,
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
        >
          <TransactionDataTableAction table={table} />
        </DataTableToolbarV2>
      }
    />
  );
}
