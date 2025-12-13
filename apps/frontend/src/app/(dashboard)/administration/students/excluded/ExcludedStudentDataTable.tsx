"use client";

import type { RouterOutputs } from "@repo/api";

import { DataTable, useDataTable } from "~/components/datatable";
import { ExcludedStudentDataTableAction } from "./ExcludedStudentDataTableAction";
import { useStudentColumns } from "./ExcludedStudentDataTableColumn";

export function ExcludedStudentDataTable({
  students,
}: {
  students: RouterOutputs["student"]["excluded"];
}) {
  const columns = useStudentColumns();
  const { table } = useDataTable({
    data: students,
    columns: columns,
  });

  return (
    <DataTable className="px-4" table={table}>
      <ExcludedStudentDataTableAction table={table} />
    </DataTable>
  );
}
