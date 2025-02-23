"use client";

import { useMemo } from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { EmptyState } from "@repo/ui/components/EmptyState";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";

import { api } from "~/trpc/react";
import { StudentDataTableActions } from "./StudentDataTableActions";
import { fetchStudentColumns } from "./StudentDataTableColumns";

export function StudentDataTable() {
  const { t } = useLocale();

  const [page] = useQueryState("page", parseAsInteger);
  const [per_page] = useQueryState("per_page", parseAsInteger);
  const [sort] = useQueryState("sort", parseAsString);
  const [lastName] = useQueryState("lastName", parseAsString);

  const studentsCountQuery = api.student.count.useQuery({
    q: lastName ?? undefined,
  });

  const studentsQuery = api.student.all.useQuery({
    page: page ?? undefined,
    per_page: per_page ?? undefined,
    sort: sort ?? undefined,
    q: lastName ?? undefined,
  });

  const columns = useMemo(() => {
    const { columns } = fetchStudentColumns({
      t: t,
    });
    return columns;
  }, [t]);

  const { table } = useDataTable({
    data: studentsQuery.data ?? [],
    columns: columns,
    rowCount: studentsCountQuery.data?.total ?? 0,
  });

  if (studentsQuery.isPending) {
    return <DataTableSkeleton rowCount={10} className="px-4" columnCount={6} />;
  }
  if (studentsQuery.error) {
    toast(studentsQuery.error.message);
    return;
  }
  if (studentsQuery.data.length === 0) {
    return <EmptyState title={t("no_data")} className="my-8" />;
  }

  return (
    <div className="px-2">
      <DataTable
        table={table}
        floatingBar={<StudentDataTableActions table={table} />}
      >
        <DataTableToolbar table={table}></DataTableToolbar>
      </DataTable>
    </div>
  );
}
