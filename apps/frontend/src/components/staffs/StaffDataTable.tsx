"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  DataTableToolbarV2,
  DataTableV2,
  DataTableViewOptionsV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { useTRPC } from "~/trpc/react";
import { StaffDataTableActions } from "./StaffDataTableAction";
import {
  staffDefaultColumnVisibility,
  useStaffColumns,
} from "./StaffDataTableColumn";

export function StaffDataTable() {
  const trpc = useTRPC();
  const { data: staffs } = useSuspenseQuery(trpc.staff.all.queryOptions());

  const columns = useStaffColumns();
  const { table } = useDataTableV2({
    data: staffs,
    columns,
    columnVisibilityKey: "staff",
    initialState: {
      columnVisibility: staffDefaultColumnVisibility,
    },
  });

  return (
    <DataTableV2
      className="px-4 pt-2"
      table={table}
      toolbar={
        <DataTableToolbarV2 table={table} searchPlaceholder="Rechercher...">
          <DataTableViewOptionsV2 table={table} />
          <StaffDataTableActions table={table} />
        </DataTableToolbarV2>
      }
    />
  );
}
