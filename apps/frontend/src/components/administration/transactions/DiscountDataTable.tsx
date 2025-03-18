"use client";

import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { useMemo } from "react";
import { toast } from "sonner";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { useLocale } from "~/i18n";

import { useSchool } from "~/providers/SchoolProvider";
import { api } from "~/trpc/react";
import { TransactionDataTableAction } from "./TransactionDataTableAction";
import { fetchTransactionColumns } from "./TransactionDataTableColumn";

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
  const { school } = useSchool();

  const columns = useMemo(
    () =>
      fetchTransactionColumns({
        t: t,
        currency: school.currency,
      }),
    [school.currency, t],
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
      floatingBar={<TransactionDataTableAction table={table} />}
      table={table}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
