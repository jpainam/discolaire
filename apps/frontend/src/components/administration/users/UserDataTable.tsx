"use client";

import { useMemo } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTable, useDataTable } from "@repo/ui/datatable/index";

import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { UserDataTableAction } from "./UserDataTableAction";
import { getUserColumns } from "./UserDataTableColumn";

export function UserDataTable() {
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(30));
  const [pageIndex] = useQueryState("pageIndex", parseAsInteger.withDefault(0));
  const usersQuery = api.user.all.useQuery({
    pageSize,
    pageIndex,
  });
  const { t } = useLocale();

  const { fullDateFormatter } = useDateFormat();
  const columns = useMemo(
    () => getUserColumns({ t: t, fullDateFormatter: fullDateFormatter }),
    [fullDateFormatter, t],
  );

  const { table } = useDataTable({
    data: usersQuery.data ?? [],
    columns: columns,
  });

  if (usersQuery.isPending) {
    return <DataTableSkeleton rowCount={10} columnCount={8} />;
  }
  return (
    <DataTable
      actionBar={<UserDataTableAction table={table} />}
      table={table}
    />
  );
}
