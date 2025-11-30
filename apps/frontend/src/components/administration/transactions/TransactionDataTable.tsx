"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { TransactionDataTableAction } from "./TransactionDataTableAction";
import { fetchTransactionColumns } from "./TransactionDataTableColumn";

export function TransactionDataTable() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status");
  const classroomId = searchParams.get("classroomId");
  const journalId = searchParams.get("journalId");

  const { data: transactions } = useSuspenseQuery(
    trpc.transaction.all.queryOptions({
      status: status ?? undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      classroomId: classroomId ?? undefined,
      journalId: journalId ?? undefined,
    }),
  );

  const t = useTranslations();
  const { school } = useSchool();

  const columns = useMemo(
    () =>
      fetchTransactionColumns({
        t: t,
        currency: school.currency,
      }),
    [t, school.currency],
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
