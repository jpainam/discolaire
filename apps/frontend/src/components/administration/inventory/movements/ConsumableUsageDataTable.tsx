"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { ConsumableUsageDataTableAction } from "./ConsumableUsageDataTableAction";
import { getColumns } from "./ConsumableUsageDataTableColumn";

export function ConsumableUsageDataTable() {
  const { t } = useLocale();
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
