"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { EnrollmentDataTableActions } from "./EnrollmentDataTableActions";
import { fetchEnrollmentColumns } from "./EnrollmentDataTableColumns";

export function EnrollmentDataTable({ classroomId }: { classroomId: string }) {
  const trpc = useTRPC();
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(classroomId)
  );
  const { t } = useLocale();

  const columns = useMemo(() => {
    const columns = fetchEnrollmentColumns({
      t: t,
    });
    return columns;
  }, [t]);

  const { table } = useDataTable({
    data: students,
    columns: columns,
    rowCount: students.length,
  });

  return (
    <DataTable table={table}>
      <EnrollmentDataTableActions table={table} />
    </DataTable>
  );
}
