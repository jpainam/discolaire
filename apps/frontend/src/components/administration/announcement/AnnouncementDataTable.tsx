"use client";

import * as React from "react";

import { useLocale } from "@repo/i18n";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import type { DataTableFilterField } from "@repo/ui/data-table/types";

import { api } from "~/trpc/react";
import { NoticeboardDataTableActions } from "./NoticeboardDataTableActions";
import { getColumns } from "./NoticeboardDataTableColumns";

export function AnnouncementDataTable() {
  const { t } = useLocale();
  const announcementsQuery = api.announcement.all.useQuery();

  const columns = React.useMemo(() => getColumns({ t }), [t]);

  const levels = React.useMemo(() => {
    if (!announcementsQuery.data) return [];
    const noticeboards = announcementsQuery.data;
    const uniqueLevels = Array.from(
      new Set(noticeboards.map((nb) => nb.level)),
    ).map((level) => ({ label: level, value: level }));
    return uniqueLevels;
  }, [announcementsQuery.data]);

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: t("Recipients"),
      value: "recipients",
      options: [
        { label: "All", value: "All" },
        { label: "Students", value: "Students" },
        { label: "Staff", value: "Staff" },
        { label: "Teachers", value: "Teachers" },
        { label: "Parents", value: "Parents" },
      ],
    },
    {
      label: t("Level"),
      value: "level",
      options: levels,
    },
  ];

  const { table } = useDataTable({
    data: announcementsQuery.data || [],
    columns: columns,
    pageCount: 1,
    filterFields: filterFields,
    defaultPerPage: 50,
    defaultSort: "title.asc",
  });

  return (
    <DataTable className="w-full p-1" variant="normal" table={table}>
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        filterFields={filterFields}
      >
        <NoticeboardDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
