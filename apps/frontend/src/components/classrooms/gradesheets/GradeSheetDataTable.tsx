"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { useDataTable } from "@repo/ui/data-table/index";

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
    pageCount: 1,
  });
  return (
    <DataTable className="px-2" variant="normal" table={table}>
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        //filterFields={filterFields}
      >
        <GradeSheetDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
