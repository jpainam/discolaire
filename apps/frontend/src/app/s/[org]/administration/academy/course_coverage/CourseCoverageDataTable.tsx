"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { CourseCoverageDataTableAction } from "./CourseCoverageDataTableAction";
import { useColumn } from "./CourseCoverageDataTableColumn";

export function CourseCoverageDataTable() {
  const trpc = useTRPC();
  const { data: classrooms } = useSuspenseQuery(
    trpc.subject.programs.queryOptions(),
  );
  const { columns } = useColumn();

  const { table } = useDataTable({
    data: classrooms,
    columns: columns,
  });

  return (
    <div className="px-4 pt-2">
      <DataTable table={table}>
        <CourseCoverageDataTableAction table={table} />
      </DataTable>
    </div>
  );
}
