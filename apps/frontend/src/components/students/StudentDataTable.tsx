"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { toast } from "sonner";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

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

  if (studentsQuery.error) {
    toast(studentsQuery.error.message);
    return;
  }

  return (
    <DataTable
      className="py-2 px-4"
      isLoading={studentsQuery.isLoading}
      table={table}
    >
      <StudentDataTableActions table={table} />
      {/* <DataTableToolbar table={table}></DataTableToolbar> */}
    </DataTable>
  );
}
