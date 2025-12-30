import type { PrismaClient } from "@repo/db";

export class EnrollmentService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  // async getRepeaters(props: { classroomId?: string; schoolYearId: string }) {
  //   const { classroomId, schoolYearId } = props;
  //   const repeaters = await this.db.$queryRaw<{ studentId: string }[]>`
  //     SELECT DISTINCT e."studentId" as "studentId"
  //     FROM "Enrollment" e
  //     JOIN "Classroom" c ON c.id = e."classroomId"
  //     WHERE e."schoolYearId" = ${schoolYearId}
  //        ${classroomId ? `AND e."classroomId" = ${classroomId}` : ""}
  //       AND EXISTS (
  //         SELECT 1 FROM "Enrollment" e2
  //         JOIN "Classroom" c2 ON c2.id = e2."classroomId"
  //         WHERE e2."studentId" = e."studentId"
  //            ${classroomId ? `AND e2."classroomId" = ${classroomId}` : ""}
  //           AND c2."levelId" = c."levelId"
  //           AND e2."schoolYearId" < e."schoolYearId"
  //       )
  //   `;
  //   const repeaterSet = new Set(repeaters.map((r) => r.studentId));
  //   return repeaterSet;
  // }

  async getCount(schoolYearId: string) {
    const schoolYear = await this.db.schoolYear.findUniqueOrThrow({
      where: { id: schoolYearId },
    });
    const students = await this.db.student.findMany({
      include: {
        enrollments: {
          where: {
            schoolYear: {
              name: {
                lte: schoolYear.name,
              },
            },
          },
        },
      },
      where: {
        enrollments: {
          some: {
            schoolYearId,
          },
        },
      },
    });
    const total = students.length;
    let male = 0;
    let active = 0;
    let newStudents = 0;
    let oldStudents = 0;
    students.forEach((student) => {
      if (student.enrollments.length === 1) {
        newStudents += 1;
      } else {
        oldStudents += 1;
      }

      if (student.gender === "male") {
        male += 1;
      }
      if (student.isActive) {
        active += 1;
      }
    });
    const contactCount = await this.db.contact.count({
      where: {
        studentContacts: {
          some: {
            studentId: {
              in: students.map((s) => s.id),
            },
          },
        },
      },
    });
    const previousYear = await this.db.schoolYear.findFirst({
      where: {
        id: {
          not: schoolYearId,
        },
      },
      orderBy: {
        name: "desc",
      },
    });
    const totalLastYear = previousYear
      ? await this.db.enrollment.count({
          where: {
            schoolYearId: previousYear.id,
          },
        })
      : 0;
    return {
      total,
      contactCount,
      totalLastYear,
      repeating: students.filter((s) => s.enrollments.length > 1).length,
      new: newStudents,
      old: oldStudents,
      male,
      female: total - male,
      active,
      inactive: total - active,
    };
  }
  async getEnrollStudents({
    schoolYearId,
    studentIds,
    limit,
  }: {
    schoolYearId: string;
    limit?: number;
    studentIds: string[];
  }) {
    const targetSchoolYearId = schoolYearId;

    // fetch the target year once (safer than comparing names)
    const currentYear = await this.db.schoolYear.findUniqueOrThrow({
      where: { id: targetSchoolYearId },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        schoolId: true,
      },
    });

    // 1) Pull students for the school, with only the enrollment fields we need.
    //    (Optionally filter to those who have an enrollment in the target year.)
    const data = await this.db.student.findMany({
      take: limit ?? 50,
      orderBy: { lastName: "desc" },
      where: {
        schoolId: currentYear.schoolId,
        ...(studentIds.length > 0 ? { id: { in: studentIds } } : {}),
        // If you only want students enrolled in the given year, uncomment:
        enrollments: { some: { schoolYearId: targetSchoolYearId } },
      },
      include: {
        formerSchool: true,
        religion: true,
        user: true,
        country: true,
        enrollments: {
          include: {
            classroom: true,
            schoolYear: true,
          },
        },
      },
    });

    const students = data.map((student) => {
      // current enrollment = enrollment whose classroom belongs to the target year
      const currentEnrollment = student.enrollments.find(
        (e) => e.schoolYearId === targetSchoolYearId,
      );

      // previous enrollments are those strictly before the current year's start
      const previousEnrollments = student.enrollments.filter(
        (e) => e.schoolYear.startDate < currentYear.startDate,
      );

      const isNew = !!currentEnrollment && student.enrollments.length === 1;
      const computedRepeating =
        currentEnrollment &&
        previousEnrollments.some(
          (e) =>
            e.classroom.levelId === currentEnrollment.classroom.levelId &&
            e.classroomId !== currentEnrollment.classroomId,
        );

      const isRepeating =
        student.enrollments.length === 1
          ? !!student.isRepeating
          : !!computedRepeating;

      // immediate “last” school year (the most recent strictly before the current)
      const lastSchoolYear = previousEnrollments
        .slice()
        .sort(
          (a, b) =>
            b.schoolYear.startDate.getTime() - a.schoolYear.startDate.getTime(),
        )[0]?.schoolYear;

      return {
        ...student,
        isNew,
        isRepeating,
        lastSchoolYear, // may be undefined if none
        classroom: currentEnrollment?.classroom ?? null,
      };
    });
    return students;
  }
}
