"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { useLocale } from "@repo/i18n";

import { Student } from "~/types/student";
import { useDateFormat } from "~/utils/date-format";
import { fetchStudentColumns } from "./students-table-columns";

export function StudentsTable() {
  const { t } = useLocale();
  const { fullDateFormatter } = useDateFormat();
  // if (isError) {
  //   showErrorToast(error);
  // }

  //const { schoolYearId } = useSchoolYear();
  const schoolYearId = "2022-2023";
  const columns = useMemo<ColumnDef<Student, unknown>[]>(
    () =>
      fetchStudentColumns({
        t: t,
        dateFormatter: fullDateFormatter,
        schoolYearId: schoolYearId ?? "",
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // const filterableColumns = fetchFilterableColumns({ t: t });
  // const { table } = useDataTable({
  //   data: data || [],
  //   columns: columns,

  //   pageCount: Math.ceil(data?.length ?? 0 / 20),
  // });
  return (
    <>
      {/* {isPending ? (
        <DataTableSkeleton rowCount={15} columnCount={8} />
      ) : (
        <DataTable
          filterableColumns={filterableColumns}
          table={table}
          variant="compact"
          topBarContent={TopBarContent(table)}
          searchPlaceholder={t("search")}
          onRowMouseclick={(row) => {
            //setStudentId(row.original.id);
          }}
          columns={columns}
          deleteRowsAction={(event) => deleteSelectedRows({ table, event })}
        />
      )} */}
    </>
  );
}
