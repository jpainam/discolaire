"use client";

import * as React from "react";

import { useLocale } from "@repo/i18n";
import { DataTable, useDataTable } from "@repo/ui/components/datatable";
import { DataTableToolbar } from "@repo/ui/components/datatable/data-table-toolbar";

import { api } from "~/trpc/react";
import { NoticeboardDataTableActions } from "./NoticeboardDataTableActions";
import { getColumns } from "./NoticeboardDataTableColumns";

export function AnnouncementDataTable() {
  const { t } = useLocale();
  const announcementsQuery = api.announcement.all.useQuery();

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
