import type { PrismaClient } from "@repo/db";

import { roundToTwo } from "../utils";
import { ReportCardService } from "./reportcard-service";

export class TrimestreService {
  private db: PrismaClient;
  private reportcard: ReportCardService;
  constructor(db: PrismaClient) {
    this.db = db;
    this.reportcard = new ReportCardService(db);
  }
  async getTermIds(
    trimestreId: "trim1" | "trim2" | "trim3",
    schoolYearId: string,
  ) {
    let seq1: string | null | undefined = null;
    let seq2: string | null | undefined = null;
    const terms = await this.db.term.findMany({
      where: {
        schoolYearId: schoolYearId,
      },
    });
    const sortedTerms = terms.sort((a, b) => a.order - b.order);
    if (trimestreId === "trim1") {
      seq1 = sortedTerms[0]?.id;
      seq2 = sortedTerms[1]?.id;
    } else if (trimestreId === "trim2") {
      seq1 = sortedTerms[2]?.id;
      seq2 = sortedTerms[3]?.id;
    } else {
      seq1 = sortedTerms[4]?.id;
      seq2 = sortedTerms[5]?.id;
    }
    if (!seq1 || !seq2) {
      throw new Error(`Invalid trimestreId, ${seq1}, ${seq2}, ${trimestreId}`);
    }
    return { seq1, seq2 };
  }
  async getTrimestreGrades(
    classroomId: string,
    trimestreId: "trim1" | "trim2" | "trim3",
    schoolId: string,
    schoolYearId: string,
  ) {
    const terms = await this.db.term.findMany({
      where: {
        schoolId: schoolId,
        schoolYearId: schoolYearId,
      },
    });
    if (terms.length < 6) {
      throw new Error(
        `Not enough terms ${terms.length} found for schoolId: ${schoolId}, schoolYearId: ${schoolYearId}`,
      );
    }
    let grades1: Awaited<ReturnType<typeof this.reportcard.getGrades>> = [];
    let grades2: Awaited<ReturnType<typeof this.reportcard.getGrades>> = [];
    let seq1: string | null | undefined = null;
    let seq2: string | null | undefined = null;
    const sortedTerms = terms.sort((a, b) => a.order - b.order);
    if (trimestreId === "trim1") {
      seq1 = sortedTerms[0]?.id;
      seq2 = sortedTerms[1]?.id;
    } else if (trimestreId === "trim2") {
      seq1 = sortedTerms[2]?.id;
      seq2 = sortedTerms[3]?.id;
    } else {
      seq1 = sortedTerms[4]?.id;
      seq2 = sortedTerms[5]?.id;
    }
    if (!seq1 || !seq2) {
      throw new Error(`Invalid trimestreId, ${seq1}, ${seq2}, ${trimestreId}`);
    }
    grades1 = await this.reportcard.getGrades(classroomId, seq1);
    grades2 = await this.reportcard.getGrades(classroomId, seq2);
    return this.computeReport(grades1, grades2);
  }

  computeReport(
    grades1: Awaited<ReturnType<typeof this.reportcard.getGrades>>,
    grades2: Awaited<ReturnType<typeof this.reportcard.getGrades>>,
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
      globalAverage: number;
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
        const g1 =
          studentGrades1.find((g) => g.subjectId === subjectId) ?? null;
        const g2 =
          studentGrades2.find((g) => g.subjectId === subjectId) ?? null;
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
      //Compute global average for this student
      const validTotals = studentCourses.filter((c) => c.total !== null);
      const totalSum = validTotals.reduce((sum, c) => sum + (c.total ?? 0), 0);
      const coeffSum = validTotals.reduce((sum, c) => sum + c.coeff, 0);
      //const globalAverage = coeffSum > 0 ? totalSum / coeffSum : 0;
      // Grade 1 and Grade 2 averages
      const valid1Totals = studentCourses.filter((c) => c.grade1 !== null);
      const total1Sum = valid1Totals.reduce(
        (sum, c) => sum + (c.grade1 ?? 0) * c.coeff,
        0,
      );
      const coeff1Sum = valid1Totals.reduce((sum, c) => sum + c.coeff, 0);
      const grade1Average = coeff1Sum > 0 ? total1Sum / coeff1Sum : 0;
      //
      const valid2Totals = studentCourses.filter((c) => c.grade2 !== null);
      const total2Sum = valid2Totals.reduce(
        (sum, c) => sum + (c.grade2 ?? 0) * c.coeff,
        0,
      );
      const coeff2Sum = valid2Totals.reduce((sum, c) => sum + c.coeff, 0);
      const grade2Average = coeff2Sum > 0 ? total2Sum / coeff2Sum : 0;
      const globalAverage =
        coeff1Sum > 0 && coeff2Sum > 0
          ? (roundToTwo(grade1Average) + roundToTwo(grade2Average)) / 2
          : coeff1Sum > 0
            ? roundToTwo(grade1Average)
            : roundToTwo(grade2Average);
      studentsReport.set(studentId, {
        studentCourses,
        global: {
          average: globalAverage,
          rank: 0,
          grade1Average: grade1Average,
          grade2Average: grade2Average,
        },
      });
      tempGlobalAverages.push({
        studentId,
        total: totalSum,
        coeffSum,
        globalAverage: globalAverage,
      });
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
    // const sortedGlobal = [...tempGlobalAverages].sort(
    //   (a, b) => b.total / (b.coeffSum || 1) - a.total / (a.coeffSum || 1),
    // );
    const sortedGlobal = [...tempGlobalAverages].sort(
      (a, b) => b.globalAverage - a.globalAverage,
    );
    const globalRanks = new Map<string, { average: number; rank: number }>();
    sortedGlobal.forEach((s, idx) => {
      //const avg = s.coeffSum > 0 ? s.total / s.coeffSum : 0;
      globalRanks.set(s.studentId, { average: s.globalAverage, rank: idx + 1 });
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
}
