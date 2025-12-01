"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { AttendanceDataTableAction } from "./AttendanceDataTableAction";
import { useColumns } from "./AttendanceDataTableColumn";

export function AttendanceDataTable() {
  const trpc = useTRPC();
  const [termId] = useQueryState("termId");

  const { data: attendances } = useSuspenseQuery(
    trpc.attendance.all.queryOptions({ termId }),
  );

  const columns = useColumns();

  const { table } = useDataTable({
    data: attendances,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <AttendanceDataTableAction table={table} />
    </DataTable>
  );
}
