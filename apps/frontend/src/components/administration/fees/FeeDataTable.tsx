"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";
import { FeeDataTableActions } from "./FeeDataTableActions";
import { fetchFeesColumns } from "./FeeDataTableColumns";

type FeeProcedureOutput = NonNullable<RouterOutputs["fee"]["all"]>;

export function FeeDataTable() {
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroom");
  const [filteredFees, setFilteredFees] = useState<FeeProcedureOutput>([]);
  const journal = searchParams.get("journal");
  const feesQuery = classroomId
    ? api.classroom.fees.useQuery(classroomId)
    : api.fee.all.useQuery();
  const fees = feesQuery.data;

  useEffect(() => {
    if (fees) {
      setFilteredFees(fees);
      // journal
      //   ? fees.filter((fee) => fee.journalId === Number(journal))
      //   : fees,
      // );
    }
  }, [fees, journal]);

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
    rowCount: Math.ceil(filteredFees.length / 10),
    defaultPageSize: 10,
  });

  if (feesQuery.isPending) {
    return (
      <DataTableSkeleton
        className="p-2"
        showViewOptions={true}
        columnCount={4}
        rowCount={15}
      />
    );
  }
  if (feesQuery.isError) {
    toast.error(feesQuery.error.message);
    return;
  }

  return (
    <DataTable className="px-2" table={table}>
      <DataTableToolbar table={table}>
        <FeeDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
