"use client";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocale } from "~/i18n";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { getRequiredColumns } from "./RequiredDatatableColumn";

export function RequiredDatatable() {
  const trpc = useTRPC();
  const { data: transactions } = useSuspenseQuery(
    trpc.transaction.required.queryOptions({}),
  );
  const { t } = useLocale();
  const { school } = useSchool();

  const columns = useMemo(
    () => getRequiredColumns({ t, currency: school.currency }),
    [school.currency, t],
  );

  const { table } = useDataTable({
    data: transactions,
    columns: columns,
  });
  return <DataTable table={table}></DataTable>;
}
