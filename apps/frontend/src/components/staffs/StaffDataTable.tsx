"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { StaffDataTableActions } from "./StaffDataTableActions";
import { fetchStaffColumns } from "./StaffDataTableColumns";

export function StaffDataTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: staffs } = useSuspenseQuery(trpc.staff.all.queryOptions());

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
      //"degreeId",
      //"employmentType",
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
