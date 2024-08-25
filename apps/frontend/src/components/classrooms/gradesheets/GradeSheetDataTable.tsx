"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { inferProcedureOutput } from "@trpc/server";

import { useLocale } from "@repo/i18n";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";

import { AppRouter } from "~/server/api/root";
import { GradeSheetDataTableActions } from "./GradeSheetDataTableActions";
import { fetchGradeSheetColumns } from "./GradeSheetDataTableColumns";

type ClassroomGradeSheetProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["gradesheets"]>
>[number];

export function GradeSheetDataTable({
  gradesheets,
}: {
  gradesheets: ClassroomGradeSheetProcedureOutput[];
}) {
  const { t } = useLocale();
  const params = useParams() as { id: string };
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
