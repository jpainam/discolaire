"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { inferProcedureOutput } from "@trpc/server";

import { useLocale } from "@repo/i18n";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { DataTableFilterField } from "@repo/ui/data-table/types";

import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { StaffDataTableActions } from "./StaffDataTableActions";
import { fetchStaffColumns } from "./StaffDataTableColumns";

type StaffDataTableProps = {
  visibles?: string[];
};
type StaffProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["staff"]["all"]>
>[number];

export function StaffDataTable({ visibles }: StaffDataTableProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<StaffProcedureOutput[]>([]);

  const staffsQuery = api.staff.all.useQuery();

  const { t } = useLocale();
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

  const columns = useMemo(
    () => {
      const { columns } = fetchStaffColumns({
        t: t,
        columns: visibles ? visibles : defaultVisibles,
      });
      return columns;
    },
    [t], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    const gender = searchParams.get("gender") || "";
    const jobTitle = searchParams.get("jobTitle") || "";
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
    setItems(v || []);
  }, [searchParams, staffsQuery.data]);

  const filterFields: DataTableFilterField<StaffProcedureOutput>[] = [
    {
      label: t("gender"),
      value: "gender",
      options: ["female", "male"].map((gender) => ({
        label: t(gender),
        value: gender,
      })),
    },
  ];

  const { table } = useDataTable({
    data: staffsQuery.data || [],
    pageCount: Math.ceil(items.length / 30),
    columns: columns,
    // optional props
    filterFields,
    defaultPageSize: 20,
  });

  if (staffsQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={8} />;
  }
  return (
    <DataTable table={table} variant="compact">
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        //filterFields={filterFields}
      >
        <StaffDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
