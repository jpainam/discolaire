"use client";

import { useMemo } from "react";

import { useLocale } from "@repo/i18n";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { DataTable, useDataTable } from "@repo/ui/datatable/index";

import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { SchoolDataTableAction } from "./SchoolDataTableAction";
import { getSchoolColumns } from "./SchoolDataTableColumn";

export function SchoolDataTable() {
  const schoolsQuery = api.formerSchool.formerSchools.useQuery();
  const { t } = useLocale();

  const { fullDateFormatter } = useDateFormat();
  const columns = useMemo(
    () => getSchoolColumns({ t, fullDateFormatter }),
    [fullDateFormatter, t],
  );

  const { table } = useDataTable({
    data: schoolsQuery.data ?? [],
    columns: columns,
    rowCount: schoolsQuery.data?.length ?? 0,
  });

  if (schoolsQuery.isPending) {
    return <DataTableSkeleton rowCount={10} columnCount={8} />;
  }
  return (
    <DataTable
      floatingBar={<SchoolDataTableAction table={table} />}
      table={table}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
