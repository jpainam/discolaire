"use client";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import type { GradeSheetTableType } from "./StudentGradesheetColumn";
import { fetchGradeSheetColumns } from "./StudentGradesheetColumn";

export function GradeSheetTable() {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const trpc = useTRPC();

  const { data: grades } = useSuspenseQuery(
    trpc.student.grades.queryOptions({ id: params.id })
  );

  const columns = useMemo(() => fetchGradeSheetColumns({ t }), [t]);

  const data: GradeSheetTableType[] = useMemo(() => {
    const vv: Record<
      number,
      { id: number; subject: string; observation: string; grades: number[] }
    > = {};

    grades.forEach((grade) => {
      if (grade.gradeSheet.subjectId) {
        vv[grade.gradeSheet.subjectId] ??= {
          id: grade.gradeSheet.subjectId,
          subject: grade.gradeSheet.subject.course.name,
          observation: grade.observation ?? "",
          grades: [],
        };
        vv[grade.gradeSheet.subjectId]?.grades.push(grade.grade);
      }
    });

    return Object.values(vv).map((entry) => ({
      subject: entry.subject,
      grade1: entry.grades[0] ?? null,
      grade2: entry.grades[1] ?? null,
      grade3: entry.grades[2] ?? null,
      grade4: entry.grades[3] ?? null,
      grade5: entry.grades[4] ?? null,
      grade6: entry.grades[5] ?? null,
      observation: entry.observation,
    }));
  }, [grades]);

  const { table } = useDataTable({
    data,
    columns,
  });

  return (
    <div className="px-4">
      <DataTable table={table} />
    </div>
  );
}
