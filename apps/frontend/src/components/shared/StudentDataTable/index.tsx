"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { useLocale } from "@repo/i18n";
import { DataTable } from "@repo/ui/data-table/v2/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/v2/data-table-toolbar";
import { DataTableFilterField } from "@repo/ui/data-table/v2/datatypes";
import { useDataTable } from "@repo/ui/data-table/v2/use-data-table";

import { useSchoolYear } from "~/hooks/use-schoolyear";
import { Student } from "~/types/student";
import { useDateFormat } from "~/utils/date-format";
import { StudentDataTableActions } from "./actions";
import { fetchStudentColumns } from "./columns";

export interface TableActions {
  onDelete?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onEnroll?: (student: Student) => void;
  onView?: (students: Student) => void;
  onUnenroll?: (student: Student) => void;
}
export default function StudentDataTable2({
  students,
  count,
  visibles,
  variant,
  action,
}: {
  students: Student[];
  count: number;
  variant?: "compact" | "normal";
  visibles?: string[];
  action: ColumnDef<Student, unknown>;
}) {
  const { t } = useLocale();
  const { fullDateFormatter } = useDateFormat();

  const filterFields: DataTableFilterField<Student>[] = [
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

  const schoolYearId = useSchoolYear();
  const defaultVisibles = [
    "select",
    "id",
    "avatar",
    "lastName",
    "firstName",
    "gender",
    "dateOfBirth",
  ];

  const columns = useMemo(
    () => {
      const { columns } = fetchStudentColumns({
        t: t,
        columns: visibles ? visibles : defaultVisibles,
        dateFormatter: fullDateFormatter,
        schoolYearId: schoolYearId ?? "",
        action: action,
      });
      return columns;
    },
    [t, fullDateFormatter, schoolYearId], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const pageCount = Math.ceil(count / students.length);

  const { table } = useDataTable({
    data: students,
    columns: columns,
    pageCount: isNaN(pageCount) ? 1 : pageCount,
    // optional props
    filterFields: filterFields,
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  });

  return (
    <>
      <DataTable
        table={table}
        variant={variant ? variant : "normal"}
        // floatingBar={<EnrollFloatingBar table={table} />}
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <StudentDataTableActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  );
}
