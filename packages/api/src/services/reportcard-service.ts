import _ from "lodash";

import { db } from "@repo/db";

import { classroomService } from "./classroom-service";
import { calculateFinalGrade, getRank } from "./utils-service";

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
export const reportCardService = {
  getStudent: async (
    classroomId: string,
    studentId: string,
    termId: number,
  ) => {
    const allGrades = await getGrades(classroomId, termId);
    const summaries = computeAveragesAndRank(allGrades);
    const studentGrades = allGrades.filter((g) => g.studentId === studentId);
    const subjectIds = new Set(studentGrades.map((g) => g.subjectId));
    let subjects = await classroomService.getSubjects(classroomId);
    subjects = subjects.filter((s) => subjectIds.has(s.id));

    const result = subjects.map((subject) => {
      const currentGrade = studentGrades.find(
        (stg) => stg.subjectId === subject.id,
      );
      const subjectGrades = allGrades.filter((g) => g.subjectId === subject.id);
      const gradesArray = subjectGrades.map((stg) => stg.grade ?? 0);

      return {
        ...subject,
        avg: currentGrade?.grade ?? 0,
        isAbsent: currentGrade?.isAbsent ?? false,
        rank:
          currentGrade?.grade != null
            ? getRank(gradesArray, currentGrade.grade)
            : -1,
        num_grades: subjectGrades.length,
        classroom: {
          max: Math.max(...gradesArray),
          min: Math.min(...gradesArray),
          avg: _.mean(gradesArray),
        },
      };
    });
    return {
      result,
      summary: {
        max: Math.max(...summaries.map((s) => s.totalAverage)),
        min: Math.min(...summaries.map((s) => s.totalAverage)),
        avg: _.mean(summaries.map((s) => s.totalAverage)),
        successRate:
          summaries.filter((s) => s.totalAverage >= 10).length /
          (summaries.length || 1e9),
        rank: summaries.find((s) => s.studentId === studentId)?.rank ?? -1,
      },
    };
  },

  getClassroom: async (classroomId: string, termId: number) => {
    const allGrades = await getGrades(classroomId, termId);
    const summaries = computeAveragesAndRank(allGrades);
    const students = await db.student.findMany({
      select: {
        id: true,
        registrationNumber: true,
        firstName: true,
        lastName: true,
        avatar: true,
        gender: true,
      },
      where: {
        enrollments: {
          some: {
            classroomId: classroomId,
          },
        },
      },
    });
    return {
      summary: {
        max: Math.max(...summaries.map((s) => s.totalAverage)),
        min: Math.min(...summaries.map((s) => s.totalAverage)),
        avg: _.mean(summaries.map((s) => s.totalAverage)),
        successRate:
          summaries.filter((s) => s.totalAverage >= 10).length /
          (summaries.length || 1e9),
      },
      result: students.map((student) => {
        const summary = summaries.find((s) => s.studentId === student.id);
        return {
          ...student,
          rank: summary?.rank ?? -1,
          avg: summary?.totalAverage,
        };
      }),
    };
  },
};

function computeAveragesAndRank(
  allGrades: Awaited<ReturnType<typeof getGrades>>,
) {
  const studentGradesMap = _.groupBy(allGrades, "studentId");
  const studentAverages = Object.entries(studentGradesMap).map(
    ([studentId, grades]) => {
      const totalCoeff = grades.reduce(
        (sum, grade) => sum + (grade.isAbsent ? 0 : grade.coefficient),
        0,
      );
      const totalPoint = grades.reduce(
        (sum, grade) =>
          sum + (grade.isAbsent ? 0 : (grade.grade ?? 0) * grade.coefficient),
        0,
      );
      const totalAverage = totalCoeff ? totalPoint / totalCoeff : 0;
      return { studentId, totalAverage };
    },
  );
  const rankedStudents = _.orderBy(studentAverages, ["totalAverage"], ["desc"]);
  return rankedStudents.map((student, index) => ({
    ...student,
    rank: index + 1,
  }));
}
