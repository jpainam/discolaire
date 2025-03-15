"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { SchoolDataTableAction } from "./SchoolDataTableAction";
import { getSchoolColumns } from "./SchoolDataTableColumn";

export function SchoolDataTable({
  schools,
}: {
  schools: RouterOutputs["formerSchool"]["all"];
}) {
  const { t } = useLocale();

  const columns = useMemo(() => getSchoolColumns({ t }), [t]);

  const { table } = useDataTable({
    data: schools,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <SchoolDataTableAction table={table} />
    </DataTable>
  );
}
