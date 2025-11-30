"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useSchool } from "~/providers/SchoolProvider";
import { getDeletedDataTableColumn } from "./DeletedDataTableColumn";

export function DeletedTransactionDataTable({
  transactions,
}: {
  transactions: RouterOutputs["transaction"]["getDeleted"];
}) {
  const t = useTranslations();
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
