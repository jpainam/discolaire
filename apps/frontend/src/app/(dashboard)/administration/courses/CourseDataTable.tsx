"use client";

import * as React from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";

import { CourseDataTableActions } from "./CourseDataTableAction";
import { getColumns } from "./CourseDataTableColumn";

export function CourseDataTable({
  courses,
}: {
  courses: RouterOutputs["course"]["all"];
}) {
  const { t } = useLocale();

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: courses,
    columns: columns,
  });

  return (
    <div className="px-4">
      <DataTable table={table}>
        <CourseDataTableActions table={table} />
      </DataTable>
    </div>
  );
}
