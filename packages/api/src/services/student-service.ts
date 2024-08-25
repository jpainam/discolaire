import { db } from "@acme/db";

export const studentService = {
  classroom: (studentId: string, schoolYearId: string) => {
    return db.classroom.findFirst({
      where: {
        enrollments: {
          some: {
            studentId: studentId,
            schoolYearId: schoolYearId,
          },
        },
      },
    });
  },
  isRepeating: async (studentId: string, schoolYearId: string) => {
    const currentClassroom = await studentService.classroom(
      studentId,
      schoolYearId,
    );
    if (!currentClassroom) {
      return false;
    }
    const enrollement = await db.enrollment.findFirst({
      where: {
        studentId: studentId,
        schoolYearId: {
          lt: schoolYearId,
        },
        classroom: {
          levelId: currentClassroom.levelId,
        },
      },
    });
    return !!enrollement;
  },
  getGrades: ({
    studentId,
    termId,
    schoolYearId,
  }: {
    studentId: string;
    termId?: number;
    schoolYearId: string;
  }) => {
    const grades = db.grade.findMany({
      where: {
        studentId: studentId,
        gradeSheet: {
          term: {
            schoolYearId: schoolYearId,
          },
        },
        ...(termId ? { gradeSheet: { termId: termId } } : {}),
      },
      orderBy: {
        gradeSheet: {
          createdAt: "asc",
        },
      },
      include: {
        gradeSheet: {
          include: {
            term: true,
            subject: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });
    return grades;
  },
};
