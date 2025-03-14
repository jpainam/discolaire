import { TRPCError } from "@trpc/server";

import { db } from "@repo/db";

import { classroomService } from "./classroom-service";

export const studentService = {
  get: async (studentId: string, schoolId: string) => {
    await db.student.update({
      where: {
        id: studentId,
        schoolId: schoolId,
      },
      data: {
        lastAccessed: new Date(),
      },
    });
    const student = await db.student.findUnique({
      where: {
        id: studentId,
        schoolId: schoolId,
      },
      include: {
        formerSchool: true,
        sports: {
          include: {
            sport: true,
          },
        },
        clubs: {
          include: {
            club: true,
          },
        },
        country: true,
        religion: true,
        studentContacts: {
          include: {
            contact: true,
            relationship: true,
          },
        },
        enrollments: {
          include: {
            classroom: true,
          },
        },
        user: {
          include: {
            roles: true,
          },
        },
      },
    });
    if (!student) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Student not found",
      });
    }
    const classroom = await studentService.getClassroom(studentId, schoolId);
    return {
      ...student,
      classroom: classroom,
    };
  },
  getFromUserId: async (userId: string) => {
    return db.student.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
  },
  getClassroomByUserId: async (userId: string, schoolYearId: string) => {
    const student = await db.student.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!student) {
      return null;
    }
    return db.classroom.findFirst({
      where: {
        schoolId: student.schoolId,
        enrollments: {
          some: {
            studentId: student.id,
            schoolYearId: schoolYearId,
          },
        },
      },
    });
  },
  getClassroom: async (studentId: string, schoolYearId: string) => {
    const classroom = await db.classroom.findFirst({
      where: {
        enrollments: {
          some: {
            studentId: studentId,
            schoolYearId: schoolYearId,
          },
        },
      },
    });
    if (!classroom) {
      return null;
    }
    return classroomService.get(classroom.id, classroom.schoolId);
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
    const students = await db.student.findMany({
      where: {
        schoolId: schoolId,
        id: {
          in: Array.isArray(studentIds) ? studentIds : [studentIds],
        },
      },
    });
    const userIds = students.map((c) => c.userId).filter((u) => u != null);
    if (userIds.length > 0) {
      await db.user.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
    }
    return db.student.deleteMany({
      where: {
        schoolId: schoolId,
        id: {
          in: Array.isArray(studentIds) ? studentIds : [studentIds],
        },
      },
    });
    /*return db.$transaction(
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
      { maxWait: 5000, timeout: 50000 },
    );*/
  },
  registrationNumberExists: async (
    registrationNumber: string,
    studentId?: string,
  ) => {
    const student = await db.student.findFirst({
      where: {
        registrationNumber: registrationNumber,
      },
    });
    return student ? !studentId || student.id !== studentId : false;
  },
  generateRegistrationNumber: async ({
    schoolId,
    schoolYearId,
  }: {
    schoolId: string;
    schoolYearId: string;
  }) => {
    const schoolYear = await db.schoolYear.findUnique({
      where: {
        id: schoolYearId,
      },
    });
    if (!schoolYear) {
      throw new Error("School year not found");
    }
    const startWidth = schoolYear.name.slice(2, 4);
    const latestStudent = await db.student.findFirst({
      where: {
        schoolId: schoolId,
        registrationNumber: {
          startsWith: startWidth,
          mode: "insensitive",
        },
      },
      orderBy: {
        registrationNumber: "desc",
      },
    });
    console.log(latestStudent);
    if (latestStudent?.registrationNumber) {
      const nextRegistration =
        (isNaN(Number(latestStudent.registrationNumber.slice(-4)))
          ? Number(latestStudent.registrationNumber.slice(-3))
          : Number(latestStudent.registrationNumber.slice(-4))) + 1;
      return `${startWidth}${nextRegistration.toString().padStart(4, "0")}`;
    }
    const school = await db.school.findUniqueOrThrow({
      where: {
        id: schoolId,
      },
    });

    return `${startWidth}${school.registrationPrefix}2001`;
  },
};
