"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "~/components/datatable";
import { useTRPC } from "~/trpc/react";
import { UserDataTableAction } from "./UserDataTableAction";
import { useUserColumns } from "./UserDataTableColumn";

export function UserDataTable() {
  const trpc = useTRPC();
  const { data: usersResponse } = useSuspenseQuery(
    trpc.user.all.queryOptions({}),
  );
  const users = usersResponse.data;

  const columns = useUserColumns();

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
