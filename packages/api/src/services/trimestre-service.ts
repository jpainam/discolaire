import { db } from "@repo/db";

import { getGrades } from "./reportcard-service";

export async function getTrimestreGrades(
  classroomId: string,
  trimestreId: string,
  schoolId: string,
  schoolYearId: string,
) {
  const terms = await db.term.findMany({
    where: {
      schoolId: schoolId,
      schoolYearId: schoolYearId,
    },
  });
  let grades1: Awaited<ReturnType<typeof getGrades>> = [];
  let grades2: Awaited<ReturnType<typeof getGrades>> = [];
  let seq1: number | null | undefined = null;
  let seq2: number | null | undefined = null;
  if (trimestreId === "trim1") {
    seq1 = terms.find((t) => t.order === 1)?.id;
    seq2 = terms.find((t) => t.order === 2)?.id;
  } else if (trimestreId === "trim2") {
    seq1 = terms.find((t) => t.order === 3)?.id;
    seq2 = terms.find((t) => t.order === 4)?.id;
  } else {
    seq1 = terms.find((t) => t.order === 5)?.id;
    seq2 = terms.find((t) => t.order === 6)?.id;
  }
  if (!seq1 || !seq2) {
    throw new Error("Invalid trimestreId");
  }
  grades1 = await getGrades(classroomId, seq1);
  grades2 = await getGrades(classroomId, seq2);
  return computeReport(grades1, grades2);
}

function computeReport(
  grades1: Awaited<ReturnType<typeof getGrades>>,
  grades2: Awaited<ReturnType<typeof getGrades>>,
): {
  studentsReport: Map<
    string,
    {
      studentCourses: {
        subjectId: number;
        grade1: number | null;
        grade2: number | null;
        average: number | null;
        coeff: number;
        total: number | null;
        rank: number;
      }[];
      global: {
        average: number;
        rank: number;
        grade1Average: number;
        grade2Average: number;
      };
    }
  >;
  summary: Map<number, { average: number; min: number; max: number }>;
  globalRanks: Map<string, { average: number; rank: number }>;
} {
  const allStudents = new Set<string>(
    [...grades1, ...grades2].map((g) => g.studentId),
  );

  const studentsReport = new Map<
    string,
    {
      studentCourses: {
        subjectId: number;
        grade1: number | null;
        grade2: number | null;
        average: number | null;
        coeff: number;
        total: number | null;
        rank: number;
      }[];
      global: {
        average: number;
        rank: number;
        grade1Average: number;
        grade2Average: number;
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
  }[] = [];
  // Step 1: Per Student Processing
  allStudents.forEach((studentId) => {
    const studentGrades1 = grades1.filter((g) => g.studentId === studentId);
    const studentGrades2 = grades2.filter((g) => g.studentId === studentId);

    const subjectIds = [
      ...new Set(
        [...studentGrades1, ...studentGrades2].map((g) => g.subjectId),
      ),
    ];
    const studentCourses: {
      subjectId: number;
      grade1: number | null;
      grade2: number | null;
      average: number | null;
      coeff: number;
      total: number | null;
      rank: number;
    }[] = [];
    subjectIds.forEach((subjectId) => {
      const g1 = studentGrades1.find((g) => g.subjectId === subjectId) ?? null;
      const g2 = studentGrades2.find((g) => g.subjectId === subjectId) ?? null;
      const grade1 = g1?.isAbsent ? null : (g1?.grade ?? null);
      const grade2 = g2?.isAbsent ? null : (g2?.grade ?? null);

      const average =
        grade1 !== null && grade2 != null
          ? (grade1 + grade2) / 2
          : (grade1 ?? grade2 ?? null);

      const coeff = g1?.coefficient ?? g2?.coefficient ?? 0;
      const total = average !== null ? average * coeff : null;
      if (g1 || g2) {
        studentCourses.push({
          subjectId,
          grade1,
          grade2,
          average,
          coeff,
          total,
          rank: 0,
        });
      }
    });
    // Compute global average for this student
    const validTotals = studentCourses.filter((c) => c.total !== null);
    const totalSum = validTotals.reduce((sum, c) => sum + (c.total ?? 0), 0);
    const coeffSum = validTotals.reduce((sum, c) => sum + c.coeff, 0);
    const globalAverage = coeffSum > 0 ? totalSum / coeffSum : 0;
    // Grade 1 and Grade 2 averages
    const valid1Totals = studentCourses.filter((c) => c.grade1 !== null);
    const total1Sum = valid1Totals.reduce((sum, c) => sum + (c.grade1 ?? 0), 0);
    const coeff1Sum = valid1Totals.reduce((sum, c) => sum + c.coeff, 0);
    const grade1Average = coeff1Sum > 0 ? total1Sum / coeff1Sum : 0;
    //
    const valid2Totals = studentCourses.filter((c) => c.grade2 !== null);
    const total2Sum = valid2Totals.reduce((sum, c) => sum + (c.grade2 ?? 0), 0);
    const coeff2Sum = valid2Totals.reduce((sum, c) => sum + c.coeff, 0);
    const grade2Average = coeff2Sum > 0 ? total2Sum / coeff2Sum : 0;
    studentsReport.set(studentId, {
      studentCourses,
      global: {
        average: globalAverage,
        rank: 0,
        grade1Average: grade1Average,
        grade2Average: grade2Average,
      },
    });
    tempGlobalAverages.push({ studentId, total: totalSum, coeffSum });
  });

  // Step 2: Course Summary (average, min, max across students)
  const subjectIds = Array.from(
    new Set([...grades1, ...grades2].map((g) => g.subjectId)),
  );
  subjectIds.forEach((subjectId) => {
    const allAverages: number[] = [];
    studentsReport.forEach((report) => {
      const subject = report.studentCourses.find(
        (c) => c.subjectId === subjectId,
      );
      if (subject && subject.average !== null) {
        allAverages.push(subject.average);
      }
    });
    if (allAverages.length) {
      const avg =
        allAverages.reduce((sum, a) => sum + a, 0) / allAverages.length;
      const min = Math.min(...allAverages);
      const max = Math.max(...allAverages);
      summary.set(subjectId, { average: avg, min, max });
    }
  });
  // Step 3: Compute rank for students globally
  const sortedGlobal = [...tempGlobalAverages].sort(
    (a, b) => b.total / (b.coeffSum || 1) - a.total / (a.coeffSum || 1),
  );
  const globalRanks = new Map<string, { average: number; rank: number }>();
  sortedGlobal.forEach((s, idx) => {
    const avg = s.coeffSum > 0 ? s.total / s.coeffSum : 0;
    globalRanks.set(s.studentId, { average: avg, rank: idx + 1 });
    const report = studentsReport.get(s.studentId);
    if (report) {
      report.global.rank = idx + 1;
    }
  });
  // Step 4: Per-course ranking inside each student report
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
      if (subject) {
        subject.rank = idx + 1;
      }
    });
  });
  return { studentsReport, summary, globalRanks };
}
