"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { DataTable, useDataTable } from "@repo/ui/datatable/index";

import { api } from "~/trpc/react";
import { StaffDataTableActions } from "./StaffDataTableActions";
import { fetchStaffColumns } from "./StaffDataTableColumns";

interface StaffDataTableProps {
  visibles?: string[];
}
type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"]>[number];

export function StaffDataTable({ visibles }: StaffDataTableProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<StaffProcedureOutput[]>([]);

  const staffsQuery = api.staff.all.useQuery();

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
      columns: visibles ? visibles : defaultVisibles,
    });
    return columns;
  }, [t, visibles]);

  useEffect(() => {
    const gender = searchParams.get("gender") ?? "";
    const jobTitle = searchParams.get("jobTitle") ?? "";
    const level = searchParams.get("level");
    const v = staffsQuery.data?.filter((staff) => {
      const g = gender != "*" && gender ? staff.gender == gender : true;
      const f =
        jobTitle != "*" && jobTitle
          ? staff.jobTitle == searchParams.get("jobTitle")
          : true;
      const l = level ? staff.degreeId == Number(level) : true;
      return g && f && l;
    });
    setItems(v ?? []);
  }, [searchParams, staffsQuery.data]);

  const { table } = useDataTable({
    data: staffsQuery.data ?? [],
    rowCount: items.length,
    columns: columns,
  });

  if (staffsQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={8} />;
  }
  return (
    <DataTable
      table={table}
      floatingBar={<StaffDataTableActions table={table} />}
    >
      <DataTableToolbar table={table}></DataTableToolbar>
    </DataTable>
  );
}
