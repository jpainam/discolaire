"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { StaffDataTableActions } from "./StaffDataTableAction";
import { useStaffColumns } from "./StaffDataTableColumn";

export function StaffDataTable() {
  const trpc = useTRPC();
  const { data: staffs } = useSuspenseQuery(trpc.staff.all.queryOptions());

  const columns = useStaffColumns();
  const { table } = useDataTable({
    data: staffs,
    columns: columns,
  });

  return (
    <DataTable className="px-4 pt-2" table={table}>
      <StaffDataTableActions table={table} />
    </DataTable>
  );
}
