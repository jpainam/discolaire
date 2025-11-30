"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { UserDataTableAction } from "./UserDataTableAction";
import { getUserColumns } from "./UserDataTableColumn";

export function UserDataTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: users } = useSuspenseQuery(trpc.user.all.queryOptions({}));

  const columns = useMemo(() => getUserColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: users,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <UserDataTableAction table={table} />
    </DataTable>
  );
}
