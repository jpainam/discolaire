"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { SchoolDataTableAction } from "./SchoolDataTableAction";
import { useSchoolColumns } from "./SchoolDataTableColumn";

export function SchoolDataTable() {
  const trpc = useTRPC();
  const { data: schools } = useSuspenseQuery(
    trpc.formerSchool.all.queryOptions(),
  );

  const columns = useSchoolColumns();

  const { table } = useDataTable({
    data: schools,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <SchoolDataTableAction table={table} />
    </DataTable>
  );
}
