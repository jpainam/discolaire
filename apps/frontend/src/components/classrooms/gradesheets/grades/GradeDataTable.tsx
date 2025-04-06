"use client";

import { useMemo } from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { fetchGradeColumns } from "./GradeDataTableColumns";

export function GradeDataTable({
  grades,
}: {
  grades: RouterOutputs["gradeSheet"]["grades"];
}) {
  const { t } = useLocale();
  //const params = useParams<{ id: string }>();
  const columns = useMemo(() => {
    return fetchGradeColumns({ t: t });
  }, [t]);

  const { table } = useDataTable({
    columns: columns,
    data: grades,
  });

  return <DataTable className="px-4" table={table}></DataTable>;
}
