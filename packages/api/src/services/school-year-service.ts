import { db } from "@repo/db";

export const schoolYearService = {
  getDefault: async (schoolId: string) => {
    const schoolyear = await db.schoolYear.findFirst({
      where: {
        isDefault: true,
        schoolId: schoolId,
      },
    });
    if (!schoolyear) {
      return db.schoolYear.findFirst({
        where: {
          schoolId: schoolId,
        },
        orderBy: {
          startDate: "desc",
        },
      });
    }
    return schoolyear;
  },
};
