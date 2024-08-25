"use client";

import { useEffect, useMemo, useState } from "react";
import { useDataTable } from "@repo/ui/data-table";

import { useLocale } from "~/hooks/use-locale";
import { api } from "~/trpc/react";
import {
  fetchGradeSheetColumns,
  GradeSheetTableType,
} from "./gradesheet-columns";

export function GradeSheetTable({ studentId }: { studentId: string }) {
  const { t } = useLocale();
  const studentGradesQuery = api.student.grades.useQuery({ id: studentId });
  const columns = useMemo(() => fetchGradeSheetColumns({ t: t }), []); // eslint-disable-line
  const [data, setData] = useState<GradeSheetTableType[]>([]);

  useEffect(() => {
    const vv: Record<
      number,
      { id: number; subject: string; observation: string; grades: number[] }
    > = {};
    if (!studentGradesQuery.data) return;
    studentGradesQuery.data.forEach((grade) => {
      if (grade?.gradeSheet?.subjectId) {
        if (!vv[grade?.gradeSheet?.subjectId]) {
          vv[grade.gradeSheet?.subjectId] = {
            id: grade.gradeSheet.subjectId,
            subject: grade.gradeSheet?.subject?.course?.name ?? "",
            observation: grade.observation ?? "",
            grades: [],
          };
        }
        vv[grade.gradeSheet.subjectId]?.grades.push(grade.grade);
      }
    });
    const groupedGrades: GradeSheetTableType[] = [];
    for (const key in vv) {
      const element = vv[key];
      groupedGrades.push({
        subject: element?.subject ?? "",
        grade1: element?.grades[0] ?? null,
        grade2: element?.grades[1] ?? null,
        grade3: element?.grades[2] ?? null,
        grade4: element?.grades[3] ?? null,
        grade5: element?.grades[4] ?? null,
        grade6: element?.grades[5] ?? null,
        observation: element?.observation ?? "",
      });
    }
    setData(groupedGrades);
  }, [studentGradesQuery.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const { table } = useDataTable({
    data: data,
    columns: columns,
    pageCount: -1,
  });

  return (
    // <DataTable
    //   //variant="compact"
    //   table={table}
    //   topBarContent={GradeSheetTopBarContent(table)}
    //   searchPlaceholder={t("search_for_an_option")}
    //   columns={columns}
    // />
    <div></div>
  );
}
