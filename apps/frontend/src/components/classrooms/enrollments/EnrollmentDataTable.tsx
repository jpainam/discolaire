"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

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

  if (classroomStudentsQuery.error) {
    toast.error(classroomStudentsQuery.error.message);
    return;
  }
  return (
    <DataTable isLoading={classroomStudentsQuery.isPending} table={table}>
      <EnrollmentDataTableActions table={table} />
    </DataTable>
  );
}
