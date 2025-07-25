"use client";

import { useMemo } from "react";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { EnrolledStudentDataTableAction } from "./EnrolledStudentDataTableAction";
import { fetchStudentColumns } from "./EnrolledStudentDataTableColumn";

export function EnrolledStudentDataTable({
  students,
}: {
  students: RouterOutputs["enrollment"]["enrolled"];
}) {
  const { t } = useLocale();

  const columns = useMemo(() => {
    return fetchStudentColumns({
      t: t,
    });
  }, [t]);

  const { table } = useDataTable({
    data: students,
    columns: columns,
  });

  return (
    <DataTable className="px-4" table={table}>
      <EnrolledStudentDataTableAction table={table} />
    </DataTable>
  );
}
