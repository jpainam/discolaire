"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";

import { api } from "~/trpc/react";
import { EnrollmentDataTableActions } from "./EnrollmentDataTableActions";
import { fetchEnrollmentColumns } from "./EnrollmentDataTableColumns";

export function EnrollmentDataTable({ classroomId }: { classroomId: string }) {
  const { t } = useLocale();
  const classroomStudentsQuery = api.classroom.students.useQuery(classroomId);
  const students = classroomStudentsQuery.data ?? [];

  const columns = useMemo(() => {
    const columns = fetchEnrollmentColumns({
      t: t,
    });
    return columns;
  }, [t]);

  const { table } = useDataTable({
    data: classroomStudentsQuery.data ?? [],
    columns: columns,
    rowCount: students.length,
  });

  if (classroomStudentsQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={7} />;
  }
  if (classroomStudentsQuery.error) {
    toast.error(classroomStudentsQuery.error.message);
    return;
  }
  return (
    <DataTable
      table={table}
      floatingBar={<EnrollmentDataTableActions table={table} />}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
