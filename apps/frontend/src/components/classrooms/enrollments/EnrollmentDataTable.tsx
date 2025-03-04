"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { EnrollmentDataTableActions } from "./EnrollmentDataTableActions";
import { fetchEnrollmentColumns } from "./EnrollmentDataTableColumns";

export function EnrollmentDataTable({
  students,
}: {
  students: RouterOutputs["classroom"]["students"];
}) {
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
