"use client";

import React from "react";
import { useParams } from "next/navigation";

import { useLocale } from "@repo/i18n";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { useDataTable } from "@repo/ui/data-table/index";

import { api } from "~/trpc/react";
import { SubjectDataTableActions } from "./SubjectDataTableActions";
import { fetchSubjectsColumns } from "./SubjectDataTableColumns";

export function SubjectDataTable() {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const subjectsQuery = api.classroom.subjects.useQuery({ id: params.id });

  const columns = React.useMemo(() => fetchSubjectsColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: subjectsQuery.data ?? [],
    columns,
    pageCount: 1,
    defaultPageSize: 50,
  });

  if (subjectsQuery.isPending) {
    return (
      <DataTableSkeleton
        className="m-2"
        columnCount={5}
        rowCount={15}
        withPagination={false}
        showViewOptions={false}
      />
    );
  }
  return (
    <DataTable variant="normal" className="px-1" table={table}>
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        //filterFields={filterFields}
      >
        <SubjectDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
