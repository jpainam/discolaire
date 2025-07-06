import { db } from "@repo/db";

export function calculateFinalGrade(
  grades: {
    isAbsent: boolean;
    grade: number | null;
    weight: number;
  }[],
): number {
  const presentGrades = grades
    .filter((g) => !g.isAbsent)
    .map((g) => ({
      ...g,
      grade: g.grade ?? 0, // null grades become 0 if present
    }));

  if (presentGrades.length === 0) return 0;

  const weightSum = presentGrades.reduce((sum, g) => sum + g.weight, 0);
  return presentGrades.reduce(
    (sum, g) => sum + g.grade * (g.weight / weightSum),
    0,
  );
}

export async function getGrades(
  classroomId: string,
  termId: string,
  minGradesThresholdRatio = 0.5,
) {
  const gradeSheets = await db.gradeSheet.findMany({
    where: {
      termId,
      subject: { classroomId },
    },
    include: {
      subject: true,
      grades: true,
    },
  });

  const gradeSheetMap = new Map<number, typeof gradeSheets>();

  for (const sheet of gradeSheets) {
    const subjectId = sheet.subjectId;
    if (!gradeSheetMap.has(subjectId)) {
      gradeSheetMap.set(subjectId, []);
    }
    gradeSheetMap.get(subjectId)?.push(sheet);
  }

  const totalSubjects = gradeSheetMap.size;
  const minGradesRequired = Math.ceil(totalSubjects * minGradesThresholdRatio);

  const results: {
    subjectId: number;
    coefficient: number;
    studentId: string;
    isAbsent: boolean;
    grade: number | null;
  }[] = [];

  const studentValidGradesCount = new Map<string, number>();

  for (const [subjectId, sheets] of gradeSheetMap.entries()) {
    const subject = sheets[0]?.subject;
    if (!subject) continue;
    const allGrades = sheets.flatMap((sheet) =>
      sheet.grades.map((g) => ({
        studentId: g.studentId,
        isAbsent: g.isAbsent ?? true,
        grade: g.grade,
        weight: sheet.weight,
      })),
    );

    const studentGradesMap = new Map<string, typeof allGrades>();

    for (const g of allGrades) {
      if (!studentGradesMap.has(g.studentId)) {
        studentGradesMap.set(g.studentId, []);
      }
      studentGradesMap.get(g.studentId)?.push(g);
    }

    for (const [studentId, grades] of studentGradesMap.entries()) {
      const isAbsent = grades.every((g) => g.isAbsent);
      const finalGrade = isAbsent ? null : calculateFinalGrade(grades);
      if (!isAbsent && finalGrade !== null) {
        const prev = studentValidGradesCount.get(studentId) ?? 0;
        studentValidGradesCount.set(studentId, prev + 1);
      }
      results.push({
        subjectId: subjectId,
        coefficient: subject.coefficient,
        studentId,
        isAbsent,
        grade: finalGrade,
      });
    }
  }
  // Filter out students with less than X valid grades
  const filteredResults = results.filter((r) => {
    const validCount = studentValidGradesCount.get(r.studentId) ?? 0;
    return validCount >= minGradesRequired;
  });

  return filteredResults;
}
