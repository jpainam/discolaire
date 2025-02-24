import { db } from "@repo/db";

export const staffService = {
  getClassrooms: async (userId: string, schoolYearId: string) => {
    const staff = await db.staff.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!staff) {
      return [];
    }
    return db.classroom.findMany({
      where: {
        OR: [
          {
            headTeacherId: staff.id,
          },
          {
            seniorAdvisorId: staff.id,
          },
          {
            subjects: {
              some: {
                teacherId: staff.id,
              },
            },
          },
        ],
        schoolYearId: schoolYearId,
        schoolId: staff.schoolId,
      },
    });
  },
};
