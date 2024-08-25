"use client";

import { useMemo } from "react";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";

import { useLocale } from "~/hooks/use-locale";
import { AppRouter } from "~/server/api/root";
import { AssignmentDataTableActions } from "./AssignmentDataTableActions";
import { fetchAssignmentTableColumns } from "./AssignmentDataTableColumns";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["assignments"]>
>[number];

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
    pageCount: assignments.length,
  });

  //return <DataTable columns={columns} table={table} />;
  return (
    <DataTable className="px-2" table={table} variant="normal">
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        //filterFields={filterFields}
      >
        <AssignmentDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
