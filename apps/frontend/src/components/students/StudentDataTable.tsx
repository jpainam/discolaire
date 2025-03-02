"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";
import { StudentDataTableActions } from "./StudentDataTableActions";
import { fetchStudentColumns } from "./StudentDataTableColumns";

export function StudentDataTable() {
  const { t } = useLocale();

  const studentsQuery = api.student.all.useQuery({});

  const columns = useMemo(() => {
    const { columns } = fetchStudentColumns({
      t: t,
    });
    return columns;
  }, [t]);

  const { table } = useDataTable({
    data: studentsQuery.data ?? [],
    columns: columns,
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
