"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { UserDataTableAction } from "./UserDataTableAction";
import { getUserColumns } from "./UserDataTableColumn";

export function UserDataTable({
  users,
}: {
  users: RouterOutputs["user"]["all"];
}) {
  const { t } = useLocale();

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
