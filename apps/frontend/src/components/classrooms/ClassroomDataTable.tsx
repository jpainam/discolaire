"use client";

import * as React from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { ClassroomDataTableActions } from "./ClassroomDataTableActions";
import { getColumns } from "./ClassroomDataTableColumns";

export function ClassroomDataTable({
  classrooms,
}: {
  classrooms: RouterOutputs["classroom"]["all"];
}) {
  const { t } = useLocale();

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: classrooms,
    columns: columns,
  });

  return (
    <div className="px-4 pt-2">
      <DataTable
        table={table}
        //floatingBar={}
      >
        <ClassroomDataTableActions table={table} />
        {/* <DataTableToolbar table={table} /> */}
      </DataTable>
    </div>
  );
}
