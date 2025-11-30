"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

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
  const t = useTranslations();
  const columns = useMemo<
    ColumnDef<ClassroomGetAssignemntProcedureOutput, unknown>[]
  >(() => fetchAssignmentTableColumns({ t: t }), [t]);

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
