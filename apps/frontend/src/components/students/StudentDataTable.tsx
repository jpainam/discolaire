"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { StudentDataTableActions } from "./StudentDataTableActions";
import { fetchStudentColumns } from "./StudentDataTableColumns";

export function StudentDataTable() {
  const trpc = useTRPC();
  const { data: students } = useSuspenseQuery(trpc.student.all.queryOptions());
  const { t } = useLocale();

  const columns = useMemo(() => {
    const { columns } = fetchStudentColumns({
      t: t,
    });
    return columns;
  }, [t]);

  const { table } = useDataTable({
    data: students,
    columns: columns,
  });

  return (
    <DataTable className="py-2 px-4 w-full" table={table}>
      <StudentDataTableActions table={table} />
      {/* <DataTableToolbar table={table}></DataTableToolbar> */}
    </DataTable>
  );
}
