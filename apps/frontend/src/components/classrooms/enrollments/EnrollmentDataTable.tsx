"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { EnrollmentDataTableActions } from "./EnrollmentDataTableActions";
import { fetchEnrollmentColumns } from "./EnrollmentDataTableColumns";

export function EnrollmentDataTable() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(params.id),
  );
  const { t } = useLocale();

  const { schoolYear } = useSchool();

  const columns = useMemo(() => {
    const columns = fetchEnrollmentColumns({
      t: t,
      isActive: schoolYear.isActive,
    });
    return columns;
  }, [t, schoolYear.isActive]);

  const { table } = useDataTable({
    data: students,
    columns: columns,
    rowCount: students.length,
  });

  return (
    <DataTable table={table}>
      <EnrollmentDataTableActions
        isActive={schoolYear.isActive}
        table={table}
      />
    </DataTable>
  );
}
