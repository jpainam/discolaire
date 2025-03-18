"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { useSchool } from "~/providers/SchoolProvider";
import { getDeletedDataTableColumn } from "./DeletedDataTableColumn";

export function TransactionDataTable({
  transactions,
}: {
  transactions: RouterOutputs["transaction"]["getDeleted"];
}) {
  const { t } = useLocale();
  const { school } = useSchool();

  const columns = useMemo(
    () =>
      getDeletedDataTableColumn({
        t: t,
        currency: school.currency,
      }),
    [t, school.currency],
  );

  const { table } = useDataTable({
    data: transactions,
    columns: columns,
  });

  return <DataTable table={table}></DataTable>;
}
