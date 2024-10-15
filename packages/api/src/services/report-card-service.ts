import type { Grade } from "@prisma/client";
import _ from "lodash";

import { db } from "@repo/db";

import { classroomService } from "./classroom-service";
import { calculateFinalGrade, getRank } from "./utils-service";

export const reportCardService = {
  getGrades: async (classroomId: string, termId: number) => {
    return db.grade.findMany({
      where: {
        gradeSheet: {
          termId: termId,
          subject: {
            classroomId: classroomId,
          },
        },
      },
      select: {
        grade: true,
        gradeSheetId: true,
        studentId: true,
        gradeSheet: true,
      },
    });
  },
  getClassroomSummary: async (classroomId: string, termId: number) => {
    /*const grades = await db.grade.findMany({
      where: {
        gradeSheet: {
          termId: termId,
          subject: {
            classroomId: classroomId,
          },
        },
      },
      select: {
        grade: true,
        gradeSheetId: true,
        studentId: true,
        gradeSheet: true,
      },
    });*/
    console.log(termId);
    const subjects = await classroomService.getSubjects(classroomId);
    /*const gradesPerSubject: Record<string, number[]> = {};
    grades.forEach((rc) => {
      if (!gradesPerSubject[rc.gradeSheet.subjectId]) {
        gradesPerSubject[rc.gradeSheet.subjectId] = [];
      }
      gradesPerSubject[rc.gradeSheet.subjectId].push(rc.average);
    });

    const result = Object.keys(gradesPerSubject).map((subjectId) => {
      return {
        subject: subjects.find((s) => s.id === Number(subjectId)) ?? null,
        avgClassroomGrade: mean(gradesPerSubject[subjectId]),
        maxClassroomGrade: Math.max(...gradesPerSubject[subjectId]),
        minClassroomGrade: Math.min(...gradesPerSubject[subjectId]),
      };
    });
    return sortBy(result, (r) => r.subject?.order);*/
    return subjects.map((subject) => {
      return {
        subject: subject,
        avgClassroomGrade: 0,
        maxClassroomGrade: 0,
        minClassroomGrade: 0,
      };
    });
  },
  getStudentSummary: async (classroomId: string, termId: number) => {
    console.log(termId);
    const students = await classroomService.getStudents(classroomId);
    return students.map((student) => {
      return {
        student: {
          id: student.id,
          avatar: student.avatar,
          registrationNumber: student.registrationNumber,
          firstName: student.firstName,
          lastName: student.lastName,
        },
        rank: 0,
        average: 0,
        absences: 0,
        lates: 0,
      };
    });
  },
  getStudent: async (studentId: string, termId: number) => {
    const term = await db.term.findUnique({
      where: {
        id: Number(termId),
      },
    });
    const classroom = await db.classroom.findFirst({
      where: {
        enrollments: {
          some: {
            studentId: studentId,
            schoolYearId: term?.schoolYearId,
          },
        },
      },
    });
    if (!classroom) {
      throw new Error("Student is not registered in any classroom");
    }
    const gradeSheets = await db.gradeSheet.findMany({
      where: {
        termId: Number(termId),
        subject: {
          classroomId: classroom.id,
        },
      },
      include: {
        grades: true,
      },
    });
    const gradeSheetMap: Record<
      string,
      {
        id: number;
        weight: number;
        scale: number;
        subjectId: number;
        grades: Grade[];
      }[]
    > = {};

    gradeSheets.forEach((sheet) => {
      if (!gradeSheetMap[sheet.subjectId]) {
        gradeSheetMap[sheet.subjectId] = [];
      }

      gradeSheetMap[sheet.subjectId]?.push({
        id: sheet.id,
        weight: sheet.weight,
        scale: sheet.scale,
        subjectId: sheet.subjectId,
        grades: sheet.grades,
      });
    });

    const subjectIds = Object.keys(gradeSheetMap);

    let subjects = await db.subject.findMany({
      include: {
        course: true,
        subjectGroup: true,
        teacher: true,
      },
      where: {
        classroomId: classroom.id,
      },
    });
    subjects = subjects.filter((s) => subjectIds.includes(s.id.toString()));
    const result = subjects.map((subject) => {
      const sheets = gradeSheetMap[subject.id] ?? [];
      const studentMapGrades: Record<string, Grade[]> = {};
      const weights: number[] = [];
      sheets.forEach((sheet) => {
        if (sheet.grades.length > 0) {
          weights.push(sheet.weight);
        }
        sheet.grades.forEach((grade) => {
          if (!studentMapGrades[grade.studentId]) {
            studentMapGrades[grade.studentId] = [];
          }
          studentMapGrades[grade.studentId]?.push(grade);
        });
      });
      const studentGrades = Object.keys(studentMapGrades).map((studentId) => {
        const isAbsent = studentMapGrades[studentId]?.every(
          (grade) => grade.isAbsent,
        );
        const _grades = studentMapGrades[studentId]
          ? studentMapGrades[studentId]
          : [];
        return {
          studentId,
          isAbsent: isAbsent,
          grade: isAbsent
            ? null
            : calculateFinalGrade(
                _grades.map((g) => {
                  return {
                    isAbsent: g.isAbsent ?? false,
                    grade: g.grade,
                  };
                }),
                weights,
              ),
        };
      });
      const currentStudentGrade = studentGrades.find(
        (stg) => stg.studentId === studentId,
      );
      const allgrades = studentGrades.filter(
        (stg) => !stg.isAbsent && stg.grade != null,
      );
      const rank =
        currentStudentGrade?.grade != null
          ? getRank(
              allgrades.map((stg) => stg.grade) as number[],
              currentStudentGrade.grade,
            )
          : -1;

      return {
        ...subject,

        avg: currentStudentGrade?.grade ?? 0,
        isAbsent: currentStudentGrade?.isAbsent ?? false,
        rank: rank,
        num_grades: allgrades.length,
        classroom: {
          max: allgrades.length
            ? Math.max(...allgrades.map((g) => g.grade ?? 0))
            : 0,
          min: allgrades.length
            ? Math.min(...allgrades.map((g) => g.grade ?? 0))
            : 0,

          avg: allgrades.length
            ? _.mean(allgrades.map((g) => g.grade ?? 0))
            : 0,
        },
      };
    });

    return result;
  },
};
