"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { inferProcedureOutput } from "@trpc/server";

import { useLocale } from "~/hooks/use-locale";
import { showErrorToast } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { FeeDataTableActions } from "./FeeDataTableActions";
import { fetchFeesColumns } from "./FeeDataTableColumns";

type FeeProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["fee"]["all"]>
>;

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
      setFilteredFees(
        journal
          ? fees.filter((fee) => fee.journalId === Number(journal))
          : fees,
      );
    }
  }, [fees, journal]);

  const { t } = useLocale();

  const columns = useMemo(
    () =>
      fetchFeesColumns({
        t: t,
      }),
    [t],
  );

  const { table } = useDataTable({
    data: filteredFees || [],
    columns,
    pageCount: Math.ceil((filteredFees || []).length / 10),
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
    showErrorToast(feesQuery.error);
    return;
  }

  return (
    <DataTable className="px-2" variant="compact" table={table}>
      <DataTableToolbar searchPlaceholder={t("search")} table={table}>
        <FeeDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
