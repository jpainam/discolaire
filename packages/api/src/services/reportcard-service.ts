import _ from "lodash";

import { db } from "@repo/db";

import { classroomService } from "./classroom-service";

export function calculateFinalGrade(
  grades: {
    isAbsent: boolean;
    grade: number;
  }[],
  weights: number[],
): number {
  const presentGrades = grades.filter(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (grade) => !grade.isAbsent && grade.grade !== null,
  );
  const presentWeights = weights.filter(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (_, i) => !grades[i]?.isAbsent && grades[i]?.grade !== null,
  );

  const weightSum = _.sum(presentWeights);
  const normalizedWeights = presentWeights.map((weight) => weight / weightSum);

  const finalGrade = presentGrades.reduce(
    (sum, grade, i) => sum + (grade.grade || 0) * (normalizedWeights[i] ?? 0),
    0,
  );

  return finalGrade;
}

export async function getGrades(classroomId: string, termId: number) {
  const gradeSheets = await db.gradeSheet.findMany({
    where: {
      termId,
      subject: {
        classroomId,
      },
    },
    include: {
      grades: true,
    },
  });
  const gradeSheetMap = _.groupBy(gradeSheets, "subjectId");

  const subjectIds = Object.keys(gradeSheetMap);
  let subjects = await classroomService.getSubjects(classroomId);
  subjects = subjects.filter((s) => subjectIds.includes(s.id.toString()));
  return _.flatMap(subjects, (subject) => {
    const sheets = gradeSheetMap[subject.id] ?? [];
    const studentGrades = _.flatten(
      sheets.map((sheet) =>
        sheet.grades.map((grade) => ({ ...grade, weight: sheet.weight })),
      ),
    );

    const studentMapGrades = _.groupBy(studentGrades, "studentId");
    const weights = sheets.map((sheet) => sheet.weight);

    return Object.entries(studentMapGrades)
      .map(([studentId, grades]) => {
        const isAbsent = grades.every((grade) => grade.isAbsent);
        return {
          ...subject,
          studentId,
          subjectId: subject.id,
          isAbsent,
          grade: isAbsent
            ? null
            : calculateFinalGrade(
                grades.map((g) => ({
                  isAbsent: g.isAbsent ?? false,
                  grade: g.grade,
                })),
                weights,
              ),
        };
      })
      .filter((g) => !g.isAbsent && g.grade != null);
  });
}
