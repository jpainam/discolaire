"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { DataTable, useDataTable } from "@repo/ui/components/datatable";
import { DataTableToolbar } from "@repo/ui/components/datatable/data-table-toolbar";

import { AssignmentDataTableActions } from "./AssignmentDataTableActions";
import { fetchAssignmentTableColumns } from "./AssignmentDataTableColumns";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["assignments"][number]
>;

export function AssignmentDataTable({
  assignments,
}: {
  assignments: ClassroomGetAssignemntProcedureOutput[];
}) {
  const { t } = useLocale();
  const columns = useMemo<
    ColumnDef<ClassroomGetAssignemntProcedureOutput, unknown>[]
  >(() => fetchAssignmentTableColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: assignments,
    columns: columns,
    rowCount: assignments.length,
  });

  return (
    <DataTable
      floatingBar={<AssignmentDataTableActions table={table} />}
      table={table}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
