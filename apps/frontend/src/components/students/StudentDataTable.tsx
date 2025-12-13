"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "~/components/datatable";
import { useTRPC } from "~/trpc/react";
import { StudentDataTableActions } from "./StudentDataTableActions";
import { useStudentColumns } from "./StudentDataTableColumns";

export function StudentDataTable() {
  const trpc = useTRPC();
  const { data: students } = useSuspenseQuery(
    trpc.enrollment.all.queryOptions(),
  );

  const columns = useStudentColumns();

  const { table } = useDataTable({
    data: students,
    columns: columns,
  });

  return (
    <DataTable className="w-full px-4 py-2" table={table}>
      <StudentDataTableActions table={table} />
      {/* <DataTableToolbar table={table}></DataTableToolbar> */}
    </DataTable>
  );
}
