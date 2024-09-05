"use client";

import { useMemo } from "react";

import { useLocale } from "@repo/i18n";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { useDataTable } from "@repo/ui/data-table/index";

import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { getUserColumns } from "./UserDataTableColumn";

export function UserDataTable() {
  const usersQuery = api.user.all.useQuery();
  const { t } = useLocale();

  const { fullDateFormatter } = useDateFormat();
  const columns = useMemo(
    () => getUserColumns({ t: t, fullDateFormatter: fullDateFormatter }),
    [fullDateFormatter, t],
  );

  const { table } = useDataTable({
    data: usersQuery.data ?? [],
    columns: columns,
    pageCount: Math.ceil(usersQuery.data?.length ?? 0 / 20),
  });

  if (usersQuery.isPending) {
    return <DataTableSkeleton rowCount={10} columnCount={8} />;
  }
  return <DataTable variant="compact" table={table}></DataTable>;
}
