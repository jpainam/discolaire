"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { SchoolDataTableAction } from "./SchoolDataTableAction";
import { getSchoolColumns } from "./SchoolDataTableColumn";

export function SchoolDataTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: schools } = useSuspenseQuery(
    trpc.formerSchool.all.queryOptions(),
  );

  const columns = useMemo(() => getSchoolColumns({ t }), [t]);

  const { table } = useDataTable({
    data: schools,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <SchoolDataTableAction table={table} />
    </DataTable>
  );
}
