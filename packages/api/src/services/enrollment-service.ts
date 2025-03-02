import { db } from "@repo/db";

export const enrollmentService = {
  getCount: async (schoolYearId: string) => {
    const students = await db.student.findMany({
      include: {
        enrollments: true,
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
    return {
      total,
      new: newStudents,
      old: oldStudents,
      male,
      female: total - male,
      active,
      inactive: total - active,
    };
  },
};
