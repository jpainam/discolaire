"use client";

import * as React from "react";

import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { DataTable, useDataTable } from "@repo/ui/datatable/index";

import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";
import { getColumns } from "./ClassroomDataTableColumns";

//type ClassroomProcedureOutput = RouterOutputs["classroom"]["all"][number];

export function ClassroomDataTable() {
  const { t } = useLocale();
  const classroomsQuery = api.classroom.all.useQuery();
  // const classroomLevelsQuery = api.classroomLevel.all.useQuery();
  // const classroomCyclesQuery = api.classroomCycle.all.useQuery();
  // const classroomSectionsQuery = api.classroomSection.all.useQuery();

  const canDeleteClassroom = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom:details",
  );

  const columns = React.useMemo(
    () => getColumns({ t: t, canDeleteClassroom }),
    [t, canDeleteClassroom],
  );

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
    // optional props
    //filterFields: filterFields,
  });

  if (classroomsQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={8} />;
  }
  return (
    <DataTable className="w-full p-2" table={table}>
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        //filterFields={filterFields}
      />
      {/* <ClassroomDataTableActions table={table} /> */}
    </DataTable>
  );
}
