"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

import { fetchGradeColumns } from "./GradeDataTableColumns";

export function GradeDataTable({
  grades,
}: {
  grades: RouterOutputs["gradeSheet"]["grades"];
}) {
  const t = useTranslations();
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
