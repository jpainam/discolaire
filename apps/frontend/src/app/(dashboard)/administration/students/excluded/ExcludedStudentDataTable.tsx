"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

import { ExcludedStudentDataTableAction } from "./ExcludedStudentDataTableAction";
import { fetchStudentColumns } from "./ExcludedStudentDataTableColumn";

export function ExcludedStudentDataTable({
  students,
}: {
  students: RouterOutputs["student"]["excluded"];
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
      <ExcludedStudentDataTableAction table={table} />
    </DataTable>
  );
}
