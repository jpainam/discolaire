"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { useTRPC } from "~/trpc/react";
import { GradeSheetDataTableActions } from "./GradeSheetDataTableActions";
import { fetchGradeSheetColumns } from "./GradeSheetDataTableColumns";

export function GradeSheetDataTable() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: gradesheets } = useSuspenseQuery(
    trpc.classroom.gradesheets.queryOptions(params.id),
  );

  const [termId] = useQueryState("term", parseAsInteger);
  const [subjectId] = useQueryState("subject", parseAsInteger);

  const filteredGradesheets = useMemo(() => {
    let result = gradesheets;

    if (subjectId && isFinite(subjectId)) {
      result = result.filter((g) => g.subjectId == subjectId);
    }
    if (termId && isFinite(termId)) {
      result = result.filter((g) => g.termId == termId);
    }
    return result;
  }, [gradesheets, subjectId, termId]);

  const { t } = useLocale();

  const columns = useMemo(() => {
    return fetchGradeSheetColumns({
      t: t,
      classroomId: params.id,
    });
  }, [t, params.id]);

  const { table } = useDataTable({
    columns: columns,
    data: filteredGradesheets,
  });
  return (
    <div className="w-full px-4">
      <DataTable table={table}>
        <GradeSheetDataTableActions table={table} />
      </DataTable>
    </div>
  );
}
