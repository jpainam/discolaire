"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { StaffDataTableActions } from "./StaffDataTableAction";
import { fetchStaffColumns } from "./StaffDataTableColumn";

export function StaffDataTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: staffs } = useSuspenseQuery(trpc.staff.all.queryOptions());

  const columns = useMemo(() => {
    return fetchStaffColumns({
      t: t,
    });
  }, [t]);

  const { table } = useDataTable({
    data: staffs,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <StaffDataTableActions table={table} />
    </DataTable>
  );
}
