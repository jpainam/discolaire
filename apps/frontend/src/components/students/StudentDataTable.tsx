"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { StudentDataTableActions } from "./StudentDataTableActions";
import { fetchStudentColumns } from "./StudentDataTableColumns";

export function StudentDataTable({
  students,
}: {
  students:
    | RouterOutputs["student"]["lastAccessed"]
    | RouterOutputs["student"]["all"];
}) {
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
