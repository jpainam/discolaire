import { db } from "@repo/db";
import redisClient from "@repo/kv";

import { classroomService } from "./classroom-service";

export const studentService = {
  get: async (studentId: string, schoolYearId: string, schoolId: string) => {
    await db.student.update({
      where: {
        id: studentId,
        schoolId: schoolId,
      },
      data: {
        lastAccessed: new Date(),
      },
    });
    const student = await db.student.findUniqueOrThrow({
      where: {
        id: studentId,
        schoolId,
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

    const currentEnrollment = student.enrollments.find(
      (enr) => enr.classroom.schoolYearId === schoolYearId,
    );

    const isRepeating =
      student.enrollments.length > 1 &&
      student.enrollments.some(
        (enr) =>
          enr.classroom.schoolYearId !== schoolYearId &&
          enr.classroom.levelId === currentEnrollment?.classroom.levelId,
      );

    return {
      ...student,
      isRepeating,
      classroom: currentEnrollment?.classroom,
    };
  },
  getFromUserId: async (userId: string) => {
    return db.student.findFirstOrThrow({
      where: {
        userId: userId,
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
    await db.studentClub.deleteMany({
      where: {
        studentId: studentId,
      },
    });
    const studentClubs = clubs.map((clubId) => {
      return {
        clubId: clubId,
        studentId: studentId,
      };
    });
    return db.studentClub.createMany({
      data: studentClubs,
    });
  },
  addSports: async (studentId: string, sports: string[]) => {
    await db.studentSport.deleteMany({
      where: {
        studentId: studentId,
      },
    });
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
  getGrades: ({
    studentId,
    termId,
    schoolYearId,
  }: {
    studentId: string;
    termId?: string;
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
                teacher: true,
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

export async function isRepeating(studentId: string, schoolYearId: string) {
  const key = `student:${studentId}:schoolYear:${schoolYearId}:isRepeating`;
  // TODO, when i edit student, i need to delete this key as well
  const _rep = await redisClient.get(key);
  // if (rep !== null) {
  //   return rep === "true";
  // }
  const enrollments = await db.enrollment.findMany({
    where: {
      studentId: studentId,
      schoolYearId: {
        lte: schoolYearId,
      },
    },
    include: {
      classroom: true,
      student: true,
    },
  });
  const curEnrollement = enrollments.find(
    (enr) => enr.classroom.schoolYearId === schoolYearId,
  );
  if (enrollments.length <= 1) {
    const r = curEnrollement?.student.isRepeating;
    void redisClient.set(key, r ? "true" : "false");
    return r;
  }

  const prevEnrollments = enrollments.filter(
    (enr) => enr.classroom.schoolYearId !== schoolYearId,
  );
  const isRepeating =
    prevEnrollments.filter(
      (prev) => prev.classroom.levelId === curEnrollement?.classroom.levelId,
    ).length > 0;
  void redisClient.set(key, isRepeating ? "true" : "false");
  return isRepeating;
}
