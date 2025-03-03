"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

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
    <div className="w-full px-4">
      <DataTable table={table}>
        <GradeSheetDataTableActions table={table} />
      </DataTable>
    </div>
  );
}
