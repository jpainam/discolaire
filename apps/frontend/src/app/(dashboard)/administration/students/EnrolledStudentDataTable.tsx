"use client";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

import { EnrolledStudentDataTableAction } from "./EnrolledStudentDataTableAction";
import { useStudentColumns } from "./EnrolledStudentDataTableColumn";

export function EnrolledStudentDataTable({
  students,
  newStudent,
}: {
  students: RouterOutputs["enrollment"]["all"];
  newStudent: boolean;
}) {
  const columns = useStudentColumns();

  const { table } = useDataTable({
    data: students,
    columns: columns,
  });

  return (
    <DataTable className="px-4" table={table}>
      <EnrolledStudentDataTableAction newStudent={newStudent} table={table} />
    </DataTable>
  );
}
