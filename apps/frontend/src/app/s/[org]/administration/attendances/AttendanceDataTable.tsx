"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { AttendanceDataTableAction } from "./AttendanceDataTableAction";
import { getColumns } from "./AttendanceDataTableColumn";

export function AttendanceDataTable() {
  const trpc = useTRPC();
  const [termId] = useQueryState("termId");

  const { data: attendances } = useSuspenseQuery(
    trpc.attendance.all.queryOptions({ termId }),
  );

  const columns = useMemo(() => {
    const columns = getColumns();
    return columns;
  }, []);

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
