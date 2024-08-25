import { db } from "@repo/db";

export const enrollmentService = {
  getCount: async (schoolYearId: string) => {
    const students = await db.student.findMany({
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
    students.forEach((student) => {
      if (student.gender === "male") {
        male += 1;
      }
      if (student.isActive) {
        active += 1;
      }
    });
    return {
      total,
      male,
      female: total - male,
      active,
      inactive: total - active,
    };
  },
};
