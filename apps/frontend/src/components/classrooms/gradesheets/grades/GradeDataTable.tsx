"use client";

import type { RouterOutputs } from "@repo/api";

import { DataTable, useDataTable } from "~/components/datatable";
import { useGradeColumns } from "./GradeDataTableColumns";

export function GradeDataTable({
  grades,
}: {
  grades: RouterOutputs["gradeSheet"]["grades"];
}) {
  //const params = useParams<{ id: string }>();
  const columns = useGradeColumns();

  const { table } = useDataTable({
    columns: columns,
    data: grades,
  });

  return <DataTable className="px-4" table={table}></DataTable>;
}
