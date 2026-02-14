"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "~/components/datatable";
import { useTRPC } from "~/trpc/react";
import { ConsumeEventDataTableAction } from "./ConsumeEventDataTableAction";
import { useConsumeEventColumns } from "./ConsumeEventDataTableColumn";

export function ConsumeEventDataTable() {
  const trpc = useTRPC();
  const { data: events } = useSuspenseQuery(trpc.inventory.events.queryOptions());
  const inventory = events.filter((event) => event.type === "CONSUME");

  const columns = useConsumeEventColumns();

  const { table } = useDataTable({
    data: inventory,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <ConsumeEventDataTableAction table={table} />
    </DataTable>
  );
}
