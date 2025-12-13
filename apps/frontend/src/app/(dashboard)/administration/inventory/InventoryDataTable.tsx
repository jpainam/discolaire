"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "~/components/datatable";
import { useTRPC } from "~/trpc/react";
import { InventoryDataTableAction } from "./InventoryDataTableAction";
import { getColumns } from "./InventoryDataTableColumn";

export function InventoryDataTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: inventory } = useSuspenseQuery(
    trpc.inventory.all.queryOptions(),
  );

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: inventory,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <InventoryDataTableAction table={table} />
    </DataTable>
  );
}
