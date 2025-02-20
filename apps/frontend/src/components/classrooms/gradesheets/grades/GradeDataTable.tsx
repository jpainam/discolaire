"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { useLocale } from "@repo/i18n";
import { DataTable, useDataTable } from "@repo/ui/components/datatable";
import { DataTableSkeleton } from "@repo/ui/components/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/components/datatable/data-table-toolbar";

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
    rowCount: gradesQuery.data?.length ?? 0,
  });
  if (gradesQuery.isPending) {
    return <DataTableSkeleton columnCount={6} rowCount={10} />;
  }
  return (
    <DataTable className="px-2" table={table}>
      <DataTableToolbar
        table={table}
        //filterFields={filterFields}
      >
        {/* <GradeSheetDataTableActions table={table} /> */}
      </DataTableToolbar>
    </DataTable>
  );
}
