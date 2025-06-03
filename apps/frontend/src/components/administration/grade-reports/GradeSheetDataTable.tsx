"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { fetchGradeSheetColumns } from "./GradeSheetDataTableColumn";

export function GradeSheetDataTable() {
  const trpc = useTRPC();
  const { data: gradesheets } = useSuspenseQuery(
    trpc.gradeSheet.all.queryOptions(),
  );

  const { t } = useLocale();

  const columns = useMemo(() => {
    return fetchGradeSheetColumns({
      t: t,
    });
  }, [t]);

  const { table } = useDataTable({
    columns: columns,
    data: gradesheets,
  });
  return <DataTable table={table} />;
}
