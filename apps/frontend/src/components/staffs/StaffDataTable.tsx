"use client";

import { useMemo } from "react";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { StaffDataTableActions } from "./StaffDataTableActions";
import { fetchStaffColumns } from "./StaffDataTableColumns";

type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"]>[number];

export function StaffDataTable({ staffs }: { staffs: StaffProcedureOutput[] }) {
  const { t } = useLocale();

  const columns = useMemo(() => {
    const defaultVisibles = [
      "select",
      "id",
      "avatar",
      "lastName",
      "firstName",
      "gender",
      "jobTitle",
      "phoneNumber1",
      "email",
      "degreeId",
      "employmentType",
      "actions",
    ];
    const { columns } = fetchStaffColumns({
      t: t,
      columns: defaultVisibles,
    });
    return columns;
  }, [t]);

  const { table } = useDataTable({
    data: staffs,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <StaffDataTableActions table={table} />
    </DataTable>
  );
}
