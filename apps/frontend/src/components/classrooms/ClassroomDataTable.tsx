"use client";

import * as React from "react";

import type { RouterOutputs } from "@repo/api";
import type { DataTableFilterField } from "@repo/data-table/types";
import { useLocale } from "@repo/i18n";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { useDataTable } from "@repo/ui/data-table/index";

import { api } from "~/trpc/react";
import { ClassroomDataTableActions } from "./ClassroomDataTableActions";
import { getColumns } from "./ClassroomDataTableColumns";

type ClassroomProcedureOutput = RouterOutputs["classroom"]["all"][number];

export function ClassroomDataTable() {
  const { t } = useLocale();
  const classroomsQuery = api.classroom.all.useQuery();
  const classroomLevelsQuery = api.classroomLevel.all.useQuery();
  const classroomCyclesQuery = api.classroomCycle.all.useQuery();
  const classroomSectionsQuery = api.classroomSection.all.useQuery();

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const filterFields: DataTableFilterField<ClassroomProcedureOutput>[] = [
    {
      label: t("level"),
      value: "levelId",
      options: classroomLevelsQuery.data?.map((level) => ({
        label: level.name,
        value: level.id.toString(),
        withCount: true,
      })),
    },
    {
      label: t("cycle"),
      value: "cycleId",
      options: classroomCyclesQuery.data?.map((cycle) => ({
        label: cycle.name,
        value: cycle.id.toString(),
        //icon: getPriorityIcon(priority),
        withCount: true,
      })),
    },
    {
      label: t("section"),
      value: "sectionId",
      options: classroomSectionsQuery.data?.map((section) => ({
        label: section.name,
        value: section.id.toString(),
      })),
    },
  ];

  const { table } = useDataTable({
    data: classroomsQuery.data || [],
    columns: columns,
    pageCount: 1,
    // optional props
    //filterFields: filterFields,
    defaultPerPage: 50,
    defaultSort: "name.asc",
  });

  if (classroomsQuery.isPending) {
    return <DataTableSkeleton rowCount={15} columnCount={8} />;
  }
  return (
    <DataTable className="w-full p-2" variant="normal" table={table}>
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        filterFields={filterFields}
      >
        <ClassroomDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
