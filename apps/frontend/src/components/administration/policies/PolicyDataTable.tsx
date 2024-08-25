"use client";

import { useMemo } from "react";

import { useLocale } from "@repo/i18n";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";

import { api } from "~/trpc/react";
import { fetchPolicyColumns } from "./PolicyDataTableColumns";

export function PolicyDataTable() {
  const policiesQuery = api.policy.all.useQuery();
  const { t } = useLocale();
  const columns = useMemo(() => {
    return fetchPolicyColumns({ t: t });
  }, [t]);
  const { table } = useDataTable({
    data: policiesQuery.data || [],
    columns: columns,
    pageCount: policiesQuery.data?.length || 0 / 50,
  });

  if (policiesQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={6} />;
  }
  return <DataTable variant="normal" table={table} />;
}
