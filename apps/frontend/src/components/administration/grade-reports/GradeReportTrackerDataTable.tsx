"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { GradeReportTrackerDataTableAction } from "./GradeReportTrackerAction";
import { useGradeTrackerColumns } from "./GradeReportTrackerColumn";

export function GradeReportTrackerDataTable() {
  const trpc = useTRPC();
  const { data: gradeTracker } = useSuspenseQuery(
    trpc.gradeSheet.gradesReportTracker.queryOptions(),
  );

  const [prevCount] = useQueryState("prevCount", parseAsInteger);
  const [classroomId] = useQueryState("classroomId");
  const [termId] = useQueryState("termId");

  const filtered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const hasFilters = classroomId || termId || prevCount != null;
    if (!hasFilters) return gradeTracker;

    return gradeTracker.filter((g) => {
      if (classroomId && g.classroomId !== classroomId) return false;

      // if (termId && !g.gradeSheets.some((gs) => gs.termId === termId)) {
      //   return false;
      // }

      if (prevCount != null && termId) {
        const termCount = g.gradeSheets.filter(
          (gs) => gs.termId === termId,
        ).length;
        if (termCount !== prevCount) return false;
      }

      return true;
    });
  }, [gradeTracker, classroomId, termId, prevCount]);

  const columns = useGradeTrackerColumns();

  const { table } = useDataTable({
    data: filtered,
    columns,
  });

  return (
    <DataTable table={table}>
      <GradeReportTrackerDataTableAction table={table} />
    </DataTable>
  );
}
