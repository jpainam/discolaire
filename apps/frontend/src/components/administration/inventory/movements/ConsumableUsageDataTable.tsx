"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { ConsumableUsageDataTableAction } from "./ConsumableUsageDataTableAction";
import { useColumns } from "./ConsumableUsageDataTableColumn";

export function ConsumableUsageDataTable() {
  const trpc = useTRPC();
  const { data: inventory } = useSuspenseQuery(
    trpc.inventory.consumableUsages.queryOptions(),
  );

  const columns = useColumns();

  const { table } = useDataTable({
    data: inventory,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <ConsumableUsageDataTableAction table={table} />
    </DataTable>
  );
}
