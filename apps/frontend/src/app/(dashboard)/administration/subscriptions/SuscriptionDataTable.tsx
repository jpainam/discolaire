"use client";

import * as React from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

import { SubscriptionDataTableAction } from "./SubscriptionDataTableAction";
import { getColumns } from "./SubscriptionDataTableColumn";

export function SubscriptionDataTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: subscriptions } = useSuspenseQuery(
    trpc.subscription.all.queryOptions({ limit: 1000 })
  );

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: subscriptions,
    columns: columns,
  });

  return (
    <div className="px-4 pt-2">
      <DataTable table={table}>
        <SubscriptionDataTableAction table={table} />
      </DataTable>
    </div>
  );
}
