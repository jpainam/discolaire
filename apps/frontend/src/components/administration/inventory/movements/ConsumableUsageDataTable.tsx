"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { ConsumableUsageDataTableAction } from "./ConsumableUsageDataTableAction";
import { getColumns } from "./ConsumableUsageDataTableColumn";

export function ConsumableUsageDataTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: inventory } = useSuspenseQuery(
    trpc.inventory.consumableUsages.queryOptions(),
  );

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

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
