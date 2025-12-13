"use client";

import type { RouterOutputs } from "@repo/api";

import { DataTable, useDataTable } from "~/components/datatable";
import { AssignmentDataTableActions } from "./AssignmentDataTableActions";
import { useAssignmentTableColumns } from "./AssignmentDataTableColumns";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["assignments"][number]
>;

export function AssignmentDataTable({
  assignments,
}: {
  assignments: ClassroomGetAssignemntProcedureOutput[];
}) {
  const columns = useAssignmentTableColumns();

  const { table } = useDataTable({
    data: assignments,
    columns: columns,
    rowCount: assignments.length,
  });

  return (
    <DataTable table={table}>
      <AssignmentDataTableActions table={table} />
    </DataTable>
  );
}
