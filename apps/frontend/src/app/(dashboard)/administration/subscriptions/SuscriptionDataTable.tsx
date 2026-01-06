"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "~/components/datatable";
import { useTRPC } from "~/trpc/react";
import { SubscriptionDataTableAction } from "./SubscriptionDataTableAction";
import { getColumns } from "./SubscriptionDataTableColumn";

export function SubscriptionDataTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: subscriptions } = useSuspenseQuery(
    trpc.notificationSubscription.all.queryOptions({ limit: 1000 }),
  );

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: subscriptions,
    columns: columns,
  });

  return (
    <div className="px-4">
      <DataTable table={table}>
        <SubscriptionDataTableAction table={table} />
      </DataTable>
    </div>
  );
}
