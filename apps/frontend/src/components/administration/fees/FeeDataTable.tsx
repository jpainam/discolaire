"use client";

import { useEffect, useMemo, useState } from "react";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useTRPC } from "~/trpc/react";
import { FeeDataTableActions } from "./FeeDataTableAction";
import { fetchFeesColumns } from "./FeeDataTableColumn";

type FeeProcedureOutput = NonNullable<RouterOutputs["fee"]["all"]>;

export function FeeDataTable() {
  const trpc = useTRPC();
  const { data: fees } = useSuspenseQuery(trpc.fee.all.queryOptions());
  const [classroomId] = useQueryState("classroomId");
  const [filteredFees, setFilteredFees] = useState<FeeProcedureOutput>(fees);

  useEffect(() => {
    if (classroomId) {
      setFilteredFees(fees.filter((fee) => fee.classroomId === classroomId));
    } else {
      setFilteredFees(fees);
    }
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
