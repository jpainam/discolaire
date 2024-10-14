import { db } from "@repo/db";

import { userService } from "./user-service";

export const studentService = {
  getClassroom: (studentId: string, schoolYearId: string) => {
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
  addClubs: async (studentId: string, clubs: string[]) => {
    const studentClubs = clubs.map((clubId) => {
      return {
        clubId: clubId,
        studentId: studentId,
      };
    });
    return db.studentClub.createMany({
      data: studentClubs,
      skipDuplicates: true,
    });
  },
  addSports: async (studentId: string, sports: string[]) => {
    const studentSports = sports.map((sportId) => {
      return {
        sportId: sportId,
        studentId: studentId,
      };
    });
    return db.studentSport.createMany({
      data: studentSports,
      skipDuplicates: true,
    });
  },
  isRepeating: async (
    studentId: string,
    schoolYearId: string,
  ): Promise<boolean> => {
    const currentClassroom = await studentService.getClassroom(
      studentId,
      schoolYearId,
    );
    const student = await db.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!student) {
      return false;
    }
    if (!currentClassroom) {
      return false;
    }
    const enrollments = await db.enrollment.findMany({
      where: {
        studentId: studentId,
      },
    });
    if (enrollments.length <= 1) {
      return student.isRepeating;
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
  getUnpaidRequiredFees: async (studentId: string, classroomId: string) => {
    const requiredFees = await db.fee.findMany({
      where: {
        classroomId: classroomId,
        isRequired: true,
        isActive: true,
      },
    });

    const paidRequiredFees = await db.requiredFeeTransaction.findMany({
      where: {
        studentId: studentId,
      },
    });
    const paidRequiredFeeIds = paidRequiredFees.map((fee) => fee.feeId);
    return requiredFees.filter((fee) => !paidRequiredFeeIds.includes(fee.id));
  },
  delete: async (studentIds: string | string[], schoolId: string) => {
    return db.$transaction(
      async (tx) => {
        const students = await tx.student.findMany({
          where: {
            schoolId: schoolId,
            id: {
              in: Array.isArray(studentIds) ? studentIds : [studentIds],
            },
          },
        });
        await tx.student.deleteMany({
          where: {
            id: {
              in: Array.isArray(studentIds) ? studentIds : [studentIds],
            },
          },
        });
        await userService.deleteUsers(
          students.map((c) => c.userId).filter((t) => t !== null),
        );
        return students;
      },
      { maxWait: 5000, timeout: 20000 },
    );
  },
};
