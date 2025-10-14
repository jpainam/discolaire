"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { FeeDataTableActions } from "./FeeDataTableAction";
import { fetchFeesColumns } from "./FeeDataTableColumn";

export function FeeDataTable() {
  const trpc = useTRPC();
  const { data: fees } = useSuspenseQuery(trpc.fee.all.queryOptions());
  const [classroomId] = useQueryState("classroomId");
  const filteredFees = useMemo(() => {
    if (classroomId) {
      return fees.filter((fee) => fee.classroomId === classroomId);
    }
    return fees;
  }, [classroomId, fees]);

  const { t } = useLocale();
  const columns = useMemo(
    () =>
      fetchFeesColumns({
        t: t,
      }),
    [t],
  );

  const { table } = useDataTable({
    data: filteredFees,
    columns,
  });

  return (
    <DataTable className="px-4" table={table}>
      <FeeDataTableActions table={table} />
    </DataTable>
  );
}
