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
    return {
      total,
      contactCount,
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
