"use client";

import { useMemo } from "react";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { DataTable, useDataTable } from "@repo/ui/components/datatable";
import { DataTableSkeleton } from "@repo/ui/components/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/components/datatable/data-table-toolbar";

import { api } from "~/trpc/react";
import { useMoneyFormat } from "~/utils/money-format";
import { TransactionDataTableActions } from "./TransactionDataTableActions";
import { fetchTransactionColumns } from "./TransactionDataTableColumns";

export function DiscountDataTable() {
  const [status] = useQueryState("status");
  const [from] = useQueryState("from", parseAsIsoDateTime);
  const [to] = useQueryState("to", parseAsIsoDateTime);
  const [classroom] = useQueryState("classroom");

  const transactionsQuery = api.transaction.all.useQuery({
    status: status ?? undefined,
    from: from ?? undefined,
    to: to ?? undefined,
    classroom: classroom ?? undefined,
  });
  //const transactionsCountQuery = api.transaction.count.useQuery();

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
  const transactions =
    transactionsQuery.data?.filter((t) => t.transactionType == "DISCOUNT") ??
    [];
  const { table } = useDataTable({
    data: transactions,
    columns: columns,
    rowCount: transactions.length,
  });

  if (transactionsQuery.isError) {
    toast.error(transactionsQuery.error.message);
    return;
  }

  if (transactionsQuery.isPending) {
    return <DataTableSkeleton rowCount={10} columnCount={6} />;
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
