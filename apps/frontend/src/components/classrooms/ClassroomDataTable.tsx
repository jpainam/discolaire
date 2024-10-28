"use client";

import * as React from "react";

import { useLocale } from "@repo/i18n";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";

import { api } from "~/trpc/react";
import { ClassroomDataTableActions } from "./ClassroomDataTableActions";
import { getColumns } from "./ClassroomDataTableColumns";

//type ClassroomProcedureOutput = RouterOutputs["classroom"]["all"][number];

export function ClassroomDataTable() {
  const { t } = useLocale();
  const classroomsQuery = api.classroom.all.useQuery();
  // const classroomLevelsQuery = api.classroomLevel.all.useQuery();
  // const classroomCyclesQuery = api.classroomCycle.all.useQuery();
  // const classroomSectionsQuery = api.classroomSection.all.useQuery();

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  // const filterFields: DataTableFilterField<ClassroomProcedureOutput>[] = [
  //   {
  //     label: t("level"),
  //     value: "levelId",
  //     options: classroomLevelsQuery.data?.map((level) => ({
  //       label: level.name,
  //       value: level.id.toString(),
  //       withCount: true,
  //     })),
  //   },
  //   {
  //     label: t("cycle"),
  //     value: "cycleId",
  //     options: classroomCyclesQuery.data?.map((cycle) => ({
  //       label: cycle.name,
  //       value: cycle.id.toString(),
  //       //icon: getPriorityIcon(priority),
  //       withCount: true,
  //     })),
  //   },
  //   {
  //     label: t("section"),
  //     value: "sectionId",
  //     options: classroomSectionsQuery.data?.map((section) => ({
  //       label: section.name,
  //       value: section.id.toString(),
  //     })),
  //   },
  // ];

  const data = classroomsQuery.data ?? [];
  const { table } = useDataTable({
    data: data,
    columns: columns,
    rowCount: data.length,
  });

  if (classroomsQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={8} />;
  }
  return (
    <DataTable
      table={table}
      floatingBar={<ClassroomDataTableActions table={table} />}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
