"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";

import { GradeSheetDataTableActions } from "./GradeSheetDataTableActions";
import { fetchGradeSheetColumns } from "./GradeSheetDataTableColumns";

type ClassroomGradeSheetProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["gradesheets"]
>[number];

export function GradeSheetDataTable({
  gradesheets,
}: {
  gradesheets: ClassroomGradeSheetProcedureOutput[];
}) {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const columns = useMemo(() => {
    return fetchGradeSheetColumns({
      t: t,
      classroomId: params.id,
    });
  }, [t, params.id]);

  const { table } = useDataTable({
    columns: columns,
    data: gradesheets,
    rowCount: gradesheets.length,
  });
  return (
    <DataTable
      className="px-2"
      table={table}
      floatingBar={<GradeSheetDataTableActions table={table} />}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
