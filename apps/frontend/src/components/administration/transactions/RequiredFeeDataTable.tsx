"use client";

import { useSearchParams } from "next/navigation";
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
  const { school } = useSchool();

  const columns = useMemo(
    () =>
      fetchTransactionColumns({
        t: t,
        currency: school.currency,
      }),
    [school.currency, t],
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
    toast.error(transactionsQuery.error.message);
    return;
  }
  return (
    <DataTable className="px-4" table={table}>
      <DataTableToolbar table={table}>
        <TransactionDataTableAction table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
