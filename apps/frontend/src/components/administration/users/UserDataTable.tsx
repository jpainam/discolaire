"use client";

import { useMemo } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { DataTable, useDataTable } from "@repo/ui/datatable/index";

import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { UserDataTableAction } from "./UserDataTableAction";
import { getUserColumns } from "./UserDataTableColumn";

export function UserDataTable() {
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(30));
  const [pageIndex] = useQueryState("pageIndex", parseAsInteger.withDefault(0));
  const [searchQuery] = useQueryState("searchQuery");
  const usersQuery = api.user.all.useQuery({
    pageSize,
    pageIndex,
    q: searchQuery ?? "",
  });
  const userCount = api.user.count.useQuery({});
  const { t } = useLocale();

  const { fullDateFormatter } = useDateFormat();
  const columns = useMemo(
    () => getUserColumns({ t: t, fullDateFormatter: fullDateFormatter }),
    [fullDateFormatter, t],
  );

  const { table } = useDataTable({
    data: usersQuery.data ?? [],
    columns: columns,
    rowCount: userCount.data ?? 0,
  });
  // const filterFields = [
  //   {
  //     label: "Email verified",
  //     value: "emailVerified",
  //     options: [
  //       { label: "Yes", value: "true" },
  //       { label: "No", value: "false" },
  //     ],
  //   },
  // ];
  if (usersQuery.isPending || userCount.isPending) {
    return <DataTableSkeleton className="mx-2" rowCount={10} columnCount={8} />;
  }
  return (
    <DataTable
      className="mx-2"
      floatingBar={<UserDataTableAction table={table} />}
      table={table}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
