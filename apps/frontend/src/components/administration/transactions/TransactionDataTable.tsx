"use client";

import { useMemo } from "react";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { DataTable, useDataTable } from "@repo/ui/datatable/index";

import { api } from "~/trpc/react";
import { useMoneyFormat } from "~/utils/money-format";
import { TransactionDataTableActions } from "./TransactionDataTableActions";
import { fetchTransactionColumns } from "./TransactionDataTableColumns";

export function TransactionDataTable() {
  const [status] = useQueryState("status");
  const [from] = useQueryState("from", parseAsIsoDateTime);
  const [to] = useQueryState("to", parseAsIsoDateTime);

  const transactionsQuery = api.transaction.all.useQuery({
    status: status ?? undefined,
    from: from ?? undefined,
    to: to ?? undefined,
  });
  const transactionsCountQuery = api.transaction.count.useQuery();

  const { t } = useLocale();

  const { moneyFormatter } = useMoneyFormat();
  const columns = useMemo(
    () =>
      fetchTransactionColumns({
        t: t,
        moneyFormatter: moneyFormatter,
      }),
    [moneyFormatter, t],
  );

  const { table } = useDataTable({
    data: transactionsQuery.data ?? [],
    columns: columns,
    rowCount:
      transactionsCountQuery.data ?? transactionsQuery.data?.length ?? 0,
  });

  if (transactionsQuery.isError || transactionsCountQuery.isError) {
    toast.error(
      transactionsCountQuery.error?.message ?? transactionsQuery.error?.message,
    );
    return;
  }

  return (
    <DataTable
      floatingBar={<TransactionDataTableActions table={table} />}
      table={table}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
