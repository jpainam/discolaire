"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { FeeDataTableActions } from "./FeeDataTableAction";
import { fetchFeesColumns } from "./FeeDataTableColumn";

type FeeProcedureOutput = NonNullable<RouterOutputs["fee"]["all"]>;

export function FeeDataTable({ fees }: { fees: FeeProcedureOutput }) {
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroom");

  const filteredFees = classroomId
    ? fees.filter((fee) => fee.classroomId === classroomId)
    : fees;

  const { t } = useLocale();
  const columns = useMemo(
    () =>
      fetchFeesColumns({
        t: t,
      }),
    [t]
  );

  const { table } = useDataTable({
    data: filteredFees,
    columns,
  });

  return (
    <DataTable table={table}>
      <FeeDataTableActions table={table} />
    </DataTable>
  );
}
