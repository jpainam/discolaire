"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { NoticeboardDataTableActions } from "./NoticeboardDataTableActions";
import { getColumns } from "./NoticeboardDataTableColumns";

export function AnnouncementDataTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const announcementsQuery = useQuery(trpc.announcement.all.queryOptions());

  const columns = React.useMemo(() => getColumns({ t }), [t]);

  const { table } = useDataTable({
    data: announcementsQuery.data ?? [],
    columns: columns,
    rowCount: announcementsQuery.data?.length ?? 0,
  });

  return (
    <DataTable className="w-full p-1" table={table}>
      <DataTableToolbar table={table}>
        <NoticeboardDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
