"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useLocale } from "@repo/i18n";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";

import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { useMoneyFormat } from "~/utils/money-format";
import { TransactionDataTableActions } from "./TransactionDataTableActions";
import { fetchTransactionColumns } from "./TransactionDataTableColumns";

export function RequiredFeeDataTable() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const transactionsQuery = api.transaction.all.useQuery({
    status: status ?? undefined,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

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
    rowCount: transactionsQuery.data?.length ?? 0,
  });
  if (transactionsQuery.isPending) {
    return <DataTableSkeleton className="px-2" rowCount={15} columnCount={8} />;
  }
  if (transactionsQuery.isError) {
    showErrorToast(transactionsQuery.error);
    return;
  }
  return (
    <DataTable className="px-2" table={table}>
      <DataTableToolbar table={table}>
        <TransactionDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
