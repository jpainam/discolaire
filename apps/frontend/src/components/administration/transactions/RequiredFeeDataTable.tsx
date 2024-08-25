"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useLocale } from "@repo/i18n";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";

import { api } from "~/trpc/react";
import { Transaction } from "~/types/transaction";
import { useMoneyFormat } from "~/utils/money-format";
import { TransactionDataTableActions } from "./TransactionDataTableActions";
import { fetchTransactionColumns } from "./TransactionDataTableColumns";

export function RequiredFeeDataTable() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const transactionsQuery = api.transaction.all.useQuery({
    status: status || undefined,
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

  const data: Transaction[] = [];
  const { table } = useDataTable({
    data: transactionsQuery.data || [],
    columns: columns,
    pageCount: 1,
  });
  if (transactionsQuery.isPending) {
    return <DataTableSkeleton className="px-2" rowCount={15} columnCount={8} />;
  }
  if (transactionsQuery.isError) {
    throw transactionsQuery.error;
  }
  return (
    <DataTable className="px-2" variant="compact" table={table}>
      <DataTableToolbar searchPlaceholder={t("search")} table={table}>
        <TransactionDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
