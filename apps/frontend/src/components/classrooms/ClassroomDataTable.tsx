"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { ClassroomDataTableAction } from "./ClassroomDataTableAction";
import { getColumns } from "./ClassroomDataTableColumn";

export function ClassroomDataTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: classrooms } = useSuspenseQuery(
    trpc.classroom.all.queryOptions(),
  );

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: classrooms,
    columns: columns,
  });

  return (
    <div className="px-4 pt-2">
      <DataTable table={table}>
        <ClassroomDataTableAction table={table} />
      </DataTable>
    </div>
  );
}
