"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTRPC } from "~/trpc/react";
import { EnrollmentDataTableActions } from "./EnrollmentDataTableActions";
import { fetchEnrollmentColumns } from "./EnrollmentDataTableColumns";

export function EnrollmentDataTable() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(params.id)
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
