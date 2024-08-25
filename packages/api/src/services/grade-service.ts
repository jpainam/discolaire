import { db } from "@repo/db";

export const gradeService = {
  getGradesByGradesheetId: async (gradesheetId: number) => {
    return db.grade.findMany({
      include: {
        student: true,
        gradeSheet: true,
      },
      where: {
        gradeSheetId: gradesheetId,
      },
    });
  },
};
