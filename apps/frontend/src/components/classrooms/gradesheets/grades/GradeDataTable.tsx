"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { useLocale } from "@repo/i18n";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { useDataTable } from "@repo/ui/data-table/index";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

import { api } from "~/trpc/react";
import { fetchGradeColumns } from "./GradeDataTableColumns";

export function GradeDataTable({ gradeSheetId }: { gradeSheetId: number }) {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const gradesQuery = api.gradeSheet.grades.useQuery(Number(gradeSheetId));
  const columns = useMemo(() => {
    return fetchGradeColumns({ t: t, classroomId: params.id });
  }, [t, params.id]);

  const { table } = useDataTable({
    columns: columns,
    data: gradesQuery.data ?? [],
    pageCount: 1,
  });
  if (gradesQuery.isPending) {
    return <DataTableSkeleton columnCount={6} rowCount={10} />;
  }
  return (
    <DataTable className="px-2" variant="compact" table={table}>
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        //filterFields={filterFields}
      >
        {/* <GradeSheetDataTableActions table={table} /> */}
      </DataTableToolbar>
    </DataTable>
  );
}
