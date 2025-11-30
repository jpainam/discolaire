"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

import { EnrolledStudentDataTableAction } from "./EnrolledStudentDataTableAction";
import { fetchStudentColumns } from "./EnrolledStudentDataTableColumn";

export function EnrolledStudentDataTable({
  students,
  newStudent,
}: {
  students: RouterOutputs["enrollment"]["all"];
  newStudent: boolean;
}) {
  const t = useTranslations();

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
      <EnrolledStudentDataTableAction newStudent={newStudent} table={table} />
    </DataTable>
  );
}
