"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { CourseDataTableActions } from "./CourseDataTableAction";
import { getColumns } from "./CourseDataTableColumn";

export function CourseDataTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: courses } = useSuspenseQuery(trpc.course.all.queryOptions());

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
