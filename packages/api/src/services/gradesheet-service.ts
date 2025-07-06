import { db } from "@repo/db";

export const gradeSheetService = {
  allPercentile: async ({
    schoolYearId,
    schoolId,
  }: {
    schoolYearId: string;
    schoolId: string;
  }) => {
    const allGrades = await db.grade.findMany({
      where: {
        gradeSheet: {
          term: {
            schoolId: schoolId,
            schoolYearId: schoolYearId,
          },
        },
      },
      select: {
        grade: true,
        gradeSheet: {
          select: {
            scale: true,
            term: true,
          },
        },
      },
    });

    // 2. Build a map: term -> array of scaled grades (0–100 or 0–20? scale to 100%)
    //    Scale each raw grade to a percent (0–100).
    //    (If you prefer 0–20, just change *100 to *20.)
    interface TermBucket {
      sum: number;
      values: number[];
    }
    const byTerm: Record<string, TermBucket> = {};

    for (const { grade, gradeSheet } of allGrades) {
      const { scale, term } = gradeSheet;
      // 2a. compute “scaled to 100%”
      let scaledPct = (grade / scale) * 100;
      if (scaledPct < 0) scaledPct = 0;
      if (scaledPct > 100) scaledPct = 100;

      byTerm[term.name] ??= { sum: 0, values: [] };
      // @ts-expect-error DO NOTHING,
      byTerm[term.name].sum += scaledPct;
      // @ts-expect-error DO NOTHING,
      byTerm[term.name].values.push(scaledPct);
    }

    // 3. For each term, sort its scaled‐grades array so we can pick percentiles.
    const chartData = Object.entries(byTerm).map(([term, { sum, values }]) => {
      values.sort((a, b) => a - b);
      const n = values.length;

      // 3a. average = sum / n
      const avg = n > 0 ? sum / n : 0;

      // 3b. bottom 10% -> value at index floor(0.10 * n)
      const idx10 = Math.floor(0.1 * n);
      const bottom = n > 0 ? values[Math.min(idx10, n - 1)] : 0;

      // 3c. top 10% -> value at index ceil(0.90 * n) - 1
      //     (e.g. if n=50, 0.9*n=45 → ceil(45)=45 → index=44)
      const idx90 = Math.ceil(0.9 * n) - 1;
      const top = n > 0 ? values[Math.max(idx90, 0)] : 0;

      return {
        term,
        average: Number(avg.toFixed(2)), // average grade for this term
        excellent: Number(top?.toFixed(2)), // 90% percentile
        below: Number(bottom?.toFixed(2)), // 0.1% percentile
      };
    });

    // 4. If you want them in a fixed Term1…Term6 order:
    const terms = await db.term.findMany({
      where: {
        schoolId: schoolId,
        schoolYearId: schoolYearId,
      },
      orderBy: {
        order: "asc",
      },
    });
    const termOrder = terms.map((t) => t.name);
    chartData.sort(
      (a, b) => termOrder.indexOf(a.term) - termOrder.indexOf(b.term),
    );

    return chartData;
  },
  percentileRawQuery: async ({
    schoolYearId,
    schoolId,
  }: {
    schoolYearId: string;
    schoolId: string;
  }) => {
    interface TermStats {
      term: string;
      avg_val: number;
      bottom_10: number;
      top_10: number;
    }

    const raw: TermStats[] = await db.$queryRaw<TermStats[]>`
      SELECT
        t.name AS term,
        ROUND(
          20.0 * AVG(
            LEAST( GREATEST( g.grade::numeric / gs.scale::numeric, 0 ), 1 )
          )::numeric,
          2
        ) AS avg_val,
        ROUND(
          PERCENTILE_CONT(0.10) WITHIN GROUP (
            ORDER BY LEAST( GREATEST( g.grade::numeric / gs.scale::numeric, 0 ), 1 )
          )::numeric * 20.0,
          2
        ) AS bottom_10,
        ROUND(
          PERCENTILE_CONT(0.90) WITHIN GROUP (
            ORDER BY LEAST( GREATEST( g.grade::numeric / gs.scale::numeric, 0 ), 1 )
          )::numeric * 20.0,
          2
        ) AS top_10
      FROM "Grade" AS g
      JOIN "GradeSheet" AS gs
        ON g."gradeSheetId" = gs.id 
      JOIN "Term" AS t
        ON gs."termId" = t.id AND t."schoolYearId" = ${schoolYearId} AND t."schoolId" = ${schoolId}
      GROUP BY
        t.name,
        t."order"
      ORDER BY
        t."order";
    `;

    const result = raw.map((r) => ({
      term: r.term,
      average: Number(r.avg_val),
      top_10: Number(r.top_10),
      bottom_10: Number(r.bottom_10),
    }));
    return result;
  },
};

export async function gradesReportTracker({
  schoolYearId,
  schoolId,
}: {
  schoolYearId: string;
  schoolId: string;
}) {
  const gradeSheets = await db.gradeSheet.findMany({
    include: {
      subject: {
        include: {
          course: true,
          teacher: true,
          classroom: true,
        },
      },
      term: true,
    },
    where: {
      term: {
        schoolId: schoolId,
        schoolYearId: schoolYearId,
      },
    },
  });

  const results = new Map<
    number,
    {
      id: number;
      subject: {
        id: number;
        course: {
          name: string;
        };
        classroom: {
          name: string;
        };
        coefficient: number;
        teacher?: {
          id?: string;
          firstName?: string | null;
          lastName?: string | null;
        };
      };
      courseName: string;
      teacherName: string;
      terms: string[];
    }
  >();
  gradeSheets.forEach((sheet) => {
    const key = sheet.subject.id;
    if (!results.has(key)) {
      results.set(key, {
        id: sheet.subject.id,
        subject: {
          id: sheet.subject.id,
          classroom: {
            name: sheet.subject.classroom.reportName,
          },
          coefficient: sheet.subject.coefficient,
          teacher: {
            id: sheet.subject.teacher?.id,
            firstName: sheet.subject.teacher?.firstName,
            lastName: sheet.subject.teacher?.lastName,
          },
          course: {
            name: sheet.subject.course.name,
          },
        },
        courseName: sheet.subject.course.name,
        teacherName: `${sheet.subject.teacher?.firstName ?? ""} ${sheet.subject.teacher?.lastName ?? ""}`,
        terms: [sheet.termId],
      });
    } else {
      const entry = results.get(key);
      entry?.terms.push(sheet.termId);
    }
  });
  const resultsArray = Array.from(results.values());
  return resultsArray;
}

export async function gradeReportTracker({ subjectId }: { subjectId: number }) {
  const reports = await db.gradeSheet.findMany({
    include: {
      term: true,
      grades: true,
    },
    orderBy: {
      term: {
        order: "asc",
      },
    },
    where: {
      subjectId,
    },
  });

  return reports.map((report) => {
    const nbAbsent = report.grades.filter((grade) => grade.isAbsent).length;
    const n = report.grades.length - nbAbsent;
    const gradeSum = report.grades.reduce((acc, grade) => acc + grade.grade, 0);
    return {
      id: report.id,
      createdAt: report.createdAt,
      name: report.name,
      nbAbsent: nbAbsent,
      n: n,
      term: report.term,
      average: n > 0 ? gradeSum / n : 0,
      scale: report.scale,
    };
  });
}
