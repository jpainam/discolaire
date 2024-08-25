"use client";

import { useMemo } from "react";
import { inferProcedureOutput } from "@trpc/server";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { DataTable } from "@repo/ui/data-table/v2/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/v2/data-table-toolbar";
import { DataTableFilterField } from "@repo/ui/data-table/v2/datatypes";
import { useDataTable } from "@repo/ui/data-table/v2/use-data-table";
import { EmptyState } from "@repo/ui/EmptyState";

import { showErrorToast } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { DataTableSkeleton } from "../data-table/data-table-skeleton";
import { StudentDataTableActions } from "./StudentDataTableActions";
import { fetchStudentColumns } from "./StudentDataTableColumns";

type StudentGetAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["student"]["all"]>
>[number];

export function StudentDataTable() {
  const { t } = useLocale();
  const { fullDateFormatter } = useDateFormat();

  const [page] = useQueryState("page", parseAsInteger);
  const [per_page] = useQueryState("per_page", parseAsInteger);
  const [sort] = useQueryState("sort", parseAsString);
  const [lastName] = useQueryState("lastName", parseAsString);
  const studentsCountQuery = api.student.count.useQuery({
    q: lastName || undefined,
  });

  const studentsQuery = api.student.all.useQuery({
    page: page || undefined,
    per_page: per_page || undefined,
    sort: sort || undefined,
    q: lastName || undefined,
  });

  const filterFields: DataTableFilterField<StudentGetAllProcedureOutput>[] = [
    {
      label: t("fullName"),
      value: "lastName",
      placeholder: t("search"),
    },
    // {
    //   label: t("gender"),
    //   value: "gender",
    //   options: ["female", "male"].map((gender) => ({
    //     label: t(gender),
    //     value: gender,
    //   })),
    // },
  ];

  const columns = useMemo(() => {
    const { columns } = fetchStudentColumns({
      t: t,
      dateFormatter: fullDateFormatter,
    });
    return columns;
  }, [t, fullDateFormatter]);

  const pageCount = Math.ceil(
    (studentsCountQuery.data?.total || 0) / (studentsQuery.data?.length || 1),
  );

  const { table } = useDataTable({
    data: studentsQuery.data || [],
    columns: columns,
    pageCount: pageCount,
    // optional props
    filterFields: filterFields,
    defaultPerPage: 20,
    defaultSort: "lastName.asc",
  });

  if (studentsQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={8} />;
  }
  if (studentsQuery.error) {
    showErrorToast(studentsQuery.error);
    return;
  }
  if (!studentsQuery.data) {
    return <EmptyState title={t("no_data")} className="my-8" />;
  }

  return (
    <div className="p-2">
      <DataTable table={table} variant={"compact"}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <StudentDataTableActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}
