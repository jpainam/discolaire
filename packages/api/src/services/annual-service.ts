import { db } from "@repo/db";

import { getGrades } from "./reportcard-service";

export async function getAnnualReport({
  classroomId,
}: {
  classroomId: string;
}) {
  const classroom = await db.classroom.findUniqueOrThrow({
    where: { id: classroomId },
  });
  const terms = await db.term.findMany({
    orderBy: { order: "asc" },
    where: { schoolYearId: classroom.schoolYearId },
  });
  if (terms.length !== 6) {
    throw new Error("Sequences non definie ou plus de 6 sequences");
  }
  const grade1Id = terms[0]?.id;
  const grade2Id = terms[1]?.id;
  const grade3Id = terms[2]?.id;
  const grade4Id = terms[3]?.id;
  const grade5Id = terms[4]?.id;
  const grade6Id = terms[5]?.id;
  if (
    !grade1Id ||
    !grade2Id ||
    !grade3Id ||
    !grade4Id ||
    !grade5Id ||
    !grade6Id
  ) {
    throw new Error("Sequences non definie ou plus de 6 sequences");
  }
  return computeReport(
    await getGrades(classroomId, grade1Id),
    await getGrades(classroomId, grade2Id),
    await getGrades(classroomId, grade3Id),
    await getGrades(classroomId, grade4Id),
    await getGrades(classroomId, grade5Id),
    await getGrades(classroomId, grade6Id),
  );
}
function computeReport(
  grades1: Awaited<ReturnType<typeof getGrades>>,
  grades2: Awaited<ReturnType<typeof getGrades>>,
  grades3: Awaited<ReturnType<typeof getGrades>>,
  grades4: Awaited<ReturnType<typeof getGrades>>,
  grades5: Awaited<ReturnType<typeof getGrades>>,
  grades6: Awaited<ReturnType<typeof getGrades>>,
): {
  studentsReport: Map<
    string,
    {
      studentCourses: {
        subjectId: number;
        grades: (number | null)[];
        average: number | null;
        coeff: number;
        total: number | null;
        rank: number;
      }[];
      global: {
        average: number;
        rank: number;
        periodAverages: number[];
      };
    }
  >;
  summary: Map<number, { average: number; min: number; max: number }>;
  globalRanks: Map<string, { average: number; rank: number }>;
} {
  const allGrades = [grades1, grades2, grades3, grades4, grades5, grades6];
  const allStudents = new Set<string>(allGrades.flat().map((g) => g.studentId));
  const studentsReport = new Map<
    string,
    {
      studentCourses: {
        subjectId: number;
        grades: (number | null)[];
        average: number | null;
        coeff: number;
        total: number | null;
        rank: number;
      }[];
      global: {
        average: number;
        rank: number;
        periodAverages: number[];
      };
    }
  >();
  const summary = new Map<
    number,
    { average: number; min: number; max: number }
  >();
  const tempGlobalAverages: {
    studentId: string;
    total: number;
    coeffSum: number;
    globalAverage: number;
  }[] = [];

  allStudents.forEach((studentId) => {
    const studentGrades = allGrades.map((grades) =>
      grades.filter((g) => g.studentId === studentId),
    );
    const subjectIds = [
      ...new Set(studentGrades.flat().map((g) => g.subjectId)),
    ];

    const studentCourses = subjectIds.map((subjectId) => {
      const subjectGrades = studentGrades.map((periodGrades) => {
        const g = periodGrades.find((gr) => gr.subjectId === subjectId);
        return g?.isAbsent ? null : (g?.grade ?? null);
      });
      const validGrades = subjectGrades.filter((g) => g !== null);
      const average =
        validGrades.length > 0
          ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length
          : null;

      const coeff =
        studentGrades
          .find((periodGrades) =>
            periodGrades.find((gr) => gr.subjectId === subjectId),
          )
          ?.find((gr) => gr.subjectId === subjectId)?.coefficient ?? 0;

      const total = average !== null ? average * coeff : null;

      return {
        subjectId,
        grades: subjectGrades,
        average,
        coeff,
        total,
        rank: 0,
      };
    });

    const validTotals = studentCourses.filter((c) => c.total !== null);
    const totalSum = validTotals.reduce((sum, c) => sum + (c.total ?? 0), 0);
    const coeffSum = validTotals.reduce((sum, c) => sum + c.coeff, 0);

    const periodAverages = Array(6)
      .fill(0)
      .map((_, i) => {
        const valid = studentCourses
          .filter((c) => c.grades[i] !== null)
          .map((c) => (c.grades[i] ?? 0) * c.coeff);
        const coeffs = studentCourses
          .filter((c) => c.grades[i] !== null)
          .map((c) => c.coeff);
        const sum = valid.reduce((a, b) => a + b, 0);
        const coeffSum = coeffs.reduce((a, b) => a + b, 0);
        return coeffSum > 0 ? sum / coeffSum : 0;
      });

    const globalAverage =
      periodAverages.reduce((a, b) => a + b, 0) / periodAverages.length;

    studentsReport.set(studentId, {
      studentCourses,
      global: {
        average: globalAverage,
        rank: 0,
        periodAverages,
      },
    });

    tempGlobalAverages.push({
      studentId,
      total: totalSum,
      coeffSum,
      globalAverage,
    });
  });

  // Summary
  const subjectIds = Array.from(
    new Set(allGrades.flat().map((g) => g.subjectId)),
  );

  subjectIds.forEach((subjectId) => {
    const allAverages: number[] = [];
    studentsReport.forEach((report) => {
      const subject = report.studentCourses.find(
        (c) => c.subjectId === subjectId,
      );
      if (subject && subject.average !== null)
        allAverages.push(subject.average);
    });
    if (allAverages.length) {
      const avg = allAverages.reduce((a, b) => a + b, 0) / allAverages.length;
      summary.set(subjectId, {
        average: avg,
        min: Math.min(...allAverages),
        max: Math.max(...allAverages),
      });
    }
  });

  // Global ranking
  const sortedGlobal = [...tempGlobalAverages].sort(
    (a, b) => b.globalAverage - a.globalAverage,
  );
  const globalRanks = new Map<string, { average: number; rank: number }>();
  sortedGlobal.forEach((s, idx) => {
    globalRanks.set(s.studentId, { average: s.globalAverage, rank: idx + 1 });
    const report = studentsReport.get(s.studentId);
    if (report) report.global.rank = idx + 1;
  });

  // Per-subject rank
  subjectIds.forEach((subjectId) => {
    const studentRankings = [...studentsReport.entries()]
      .map(([studentId, report]) => {
        const subject = report.studentCourses.find(
          (c) => c.subjectId === subjectId,
        );
        return { studentId, avg: subject?.average ?? null };
      })
      .filter((c) => c.avg !== null)
      .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));

    studentRankings.forEach((entry, idx) => {
      const student = studentsReport.get(entry.studentId);
      const subject = student?.studentCourses.find(
        (c) => c.subjectId === subjectId,
      );
      if (subject) subject.rank = idx + 1;
    });
  });

  return { studentsReport, summary, globalRanks };
}
