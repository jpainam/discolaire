import { db } from "@repo/db";

export const enrollmentService = {
  getCount: async (schoolYearId: string) => {
    const schoolYear = await db.schoolYear.findUniqueOrThrow({
      where: { id: schoolYearId },
    });
    const students = await db.student.findMany({
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
    const contactCount = await db.contact.count({
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
    const previousYear = await db.schoolYear.findFirst({
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
      ? await db.enrollment.count({
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
  },
};

export async function getEnrollStudents({
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
  const currentYear = await db.schoolYear.findUniqueOrThrow({
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
  const data = await db.student.findMany({
    take: limit ?? 50,
    orderBy: { lastName: "desc" },
    where: {
      schoolId: currentYear.schoolId,
      ...(studentIds.length > 0 ? { id: { in: studentIds } } : {}),
      // If you only want students enrolled in the given year, uncomment:
      enrollments: { some: { schoolYearId: targetSchoolYearId } },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      lastAccessed: true,
      registrationNumber: true,
      dateOfEntry: true,
      residence: true,
      phoneNumber: true,
      placeOfBirth: true,
      isRepeating: true,
      dateOfBirth: true,
      // keep only what you use; add more fields if you really need them
      formerSchool: true,
      gender: true,
      religion: true,
      user: true,
      country: true,
      enrollments: {
        select: {
          id: true,
          schoolYearId: true,
          schoolYear: { select: { id: true, name: true, startDate: true } },
          classroomId: true,
          classroom: {
            select: { id: true, name: true, levelId: true, reportName: true },
          },
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
