"use client";

import { useMemo } from "react";
import { useLocale } from "@/hooks/use-locale";
import { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { DataTableFilterField } from "@repo/ui/data-table/types";
import { inferProcedureOutput } from "@trpc/server";

import { EnrollmentDataTableActions } from "./EnrollmentDataTableActions";
import { fetchEnrollmentColumns } from "./EnrollmentDataTableColumns";

type ClassroomStudentProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["students"]>
>[number];

export default function EnrollmentDataTable({
  classroomId,
}: {
  classroomId: string;
}) {
  const { t } = useLocale();
  const classroomStudentsQuery = api.classroom.students.useQuery(classroomId);
  // const canUnEnrollStudent = useCheckPermissions(
  //   PermissionAction.DELETE,
  //   "classroom:enrollment"
  // );

  const filterFields: DataTableFilterField<ClassroomStudentProcedureOutput>[] =
    [
      {
        label: t("fullName"),
        value: "firstName",
        placeholder: t("search"),
      },
      {
        label: t("gender"),
        value: "gender",
        options: ["female", "male"].map((gender) => ({
          label: t(gender),
          value: gender,
        })),
      },
    ];

  const columns = useMemo(() => {
    const columns = fetchEnrollmentColumns({
      t: t,
      canUnEnrollStudent: true,
    });
    return columns;
  }, [t]); // eslint-disable-line react-hooks/exhaustive-deps
  const pageCount = classroomStudentsQuery.data?.length || 0 / 50;

  const { table } = useDataTable({
    data: classroomStudentsQuery.data || [],
    columns: columns,
    filterFields: filterFields,
    pageCount: pageCount,
  });

  if (classroomStudentsQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={7} />;
  }
  if (classroomStudentsQuery.error) {
    throw classroomStudentsQuery.error;
  }
  return (
    <div className="p-1">
      <DataTable
        table={table}
        variant={"compact"}
        // floatingBar={<EnrollFloatingBar table={table} />}
      >
        <DataTableToolbar
          searchPlaceholder={t("search")}
          table={table}
          filterFields={filterFields}
        >
          <EnrollmentDataTableActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}
