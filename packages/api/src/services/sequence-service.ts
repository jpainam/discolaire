import { roundToTwo } from "../utils";
import { getGrades } from "./reportcard-service";

export async function getSequenceGrades(
  classroomId: string,
  sequenceId: string,
): Promise<{
  studentsReport: Map<
    string,
    {
      studentCourses: {
        subjectId: number;
        grade: number | null;
        average: number | null;
        coeff: number;
        total: number | null;
        rank: number;
      }[];
      global: {
        average: number;
        rank: number;
      };
    }
  >;
  summary: Map<number, { average: number; min: number; max: number }>;
  globalRanks: Map<
    string,
    { average: number; rank: number; aequoRank: string }
  >;
}> {
  const grades = await getGrades(classroomId, sequenceId);
  const allStudents = new Set<string>(grades.map((g) => g.studentId));

  const studentsReport = new Map<
    string,
    {
      studentCourses: {
        subjectId: number;
        grade: number | null;
        average: number | null;
        coeff: number;
        total: number | null;
        rank: number;
      }[];
      global: {
        average: number;
        rank: number;
        aequoRank: string;
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
  // Step 1: Per Student Processing
  allStudents.forEach((studentId) => {
    const studentGrades = grades.filter((g) => g.studentId === studentId);
    const subjectIds = [...new Set(studentGrades.map((g) => g.subjectId))];
    const studentCourses: {
      subjectId: number;
      grade: number | null;
      average: number | null;
      coeff: number;
      total: number | null;
      rank: number;
    }[] = [];
    subjectIds.forEach((subjectId) => {
      const g = studentGrades.find((g) => g.subjectId === subjectId) ?? null;
      const grade = g?.isAbsent ? null : (g?.grade ?? null);
      const average = grade ?? null;
      const coeff = g?.coefficient ?? 0;
      const total = average !== null ? average * coeff : null;
      if (g) {
        studentCourses.push({
          subjectId,
          grade,
          average,
          coeff,
          total,
          rank: 0,
        });
      }
    });
    //Compute global average for this student
    const validTotals = studentCourses.filter((c) => c.total !== null);
    const totalSum = validTotals.reduce((sum, c) => sum + (c.total ?? 0), 0);
    const coeffSum = validTotals.reduce((sum, c) => sum + c.coeff, 0);
    const globalAverage = coeffSum > 0 ? totalSum / coeffSum : 0;

    studentsReport.set(studentId, {
      studentCourses,
      global: {
        average: roundToTwo(globalAverage),
        rank: 0,
        aequoRank: "",
      },
    });
    tempGlobalAverages.push({
      studentId,
      total: totalSum,
      coeffSum,
      globalAverage: roundToTwo(globalAverage),
    });
  });

  // Step 2: Course Summary (average, min, max across students)
  const subjectIds = Array.from(new Set(grades.map((g) => g.subjectId)));
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
    (a, b) => b.globalAverage - a.globalAverage,
  );
  const globalRanks = new Map<
    string,
    { average: number; rank: number; aequoRank: string }
  >();
  let rank = 1;
  let lastScore: number | null = null;
  let tieCount = 0;
  sortedGlobal.forEach((s, idx) => {
    if (s.globalAverage !== lastScore) {
      rank = idx + 1;
      lastScore = s.globalAverage;
      tieCount = 1;
    } else {
      tieCount++;
    }
    const aequoRank = tieCount > 1 ? `${rank} ex` : `${rank}`;
    globalRanks.set(s.studentId, {
      average: s.globalAverage,
      rank: idx + 1,
      aequoRank,
    });
    const report = studentsReport.get(s.studentId);
    if (report) {
      report.global.rank = idx + 1;
      report.global.aequoRank = aequoRank;
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
