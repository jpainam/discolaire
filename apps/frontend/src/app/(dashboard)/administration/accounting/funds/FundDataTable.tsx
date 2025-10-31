"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { fetchFundColumns } from "./FundDataTableColumn";

export function FundDataTable() {
  const trpc = useTRPC();
  const fundQuery = useQuery(trpc.fund.all.queryOptions({}));
  const columns = useMemo(() => fetchFundColumns(), []);
  const { table } = useDataTable({
    columns: columns,
    data: fundQuery.data ?? [],
  });
  return <DataTable className="w-full" table={table}></DataTable>;
}
