"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useSchool } from "~/providers/SchoolProvider";
import { TransactionDataTableAction } from "./TransactionDataTableAction";
import { fetchTransactionColumns } from "./TransactionDataTableColumn";

export function DiscountDataTable({
  transactions,
}: {
  transactions: RouterOutputs["transaction"]["all"];
}) {
  const t = useTranslations();
  const { school } = useSchool();

  const columns = useMemo(
    () =>
      fetchTransactionColumns({
        t: t,
        currency: school.currency,
      }),
    [school.currency, t],
  );

  const { table } = useDataTable({
    data: transactions,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <TransactionDataTableAction table={table} />
    </DataTable>
  );
}
