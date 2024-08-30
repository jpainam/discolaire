import { db } from "@repo/db";

export const schoolYearService = {
  getDefault: async () => {
    const schoolyear = await db.schoolYear.findFirst({
      where: {
        isDefault: true,
      },
    });
    if (!schoolyear) {
      return db.schoolYear.findFirst({
        orderBy: {
          startDate: "desc",
        },
      });
    }
    return schoolyear;
  },
};
