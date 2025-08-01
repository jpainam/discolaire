"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { CourseCoverageDataTableAction } from "./CourseCoverageDataTableAction";
import { useColumn } from "./CourseCoverageDataTableColumn";

export function CourseCoverageDataTable() {
  const trpc = useTRPC();
  const [{ classroomId, staffId, categoryId }] = useQueryStates({
    classroomId: parseAsString.withDefault(""),
    staffId: parseAsString.withDefault(""),
    categoryId: parseAsString.withDefault(""),
  });
  const { data: programs } = useSuspenseQuery(
    trpc.subject.programs.queryOptions({
      classroomId,
      staffId,
      categoryId,
    }),
  );
  const { columns } = useColumn();

  const { table } = useDataTable({
    data: programs,
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
