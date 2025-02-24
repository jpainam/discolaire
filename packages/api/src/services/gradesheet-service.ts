import { db } from "@repo/db";

export const gradeSheetService = {
  sucessRate: async (gradeSheetId: number) => {
    const grades = await db.grade.findMany({
      include: {
        student: true,
      },
      where: {
        gradeSheetId: gradeSheetId,
      },
    });
    let female = 0;
    let femaleAvg = 0;
    let maleAvg = 0;
    let male = 0;
    let numberOfAvg = 0;
    grades.forEach((grade) => {
      if (grade.grade >= 10) {
        numberOfAvg += 1;
        if (grade.student.gender === "female") {
          femaleAvg += 1;
        } else {
          maleAvg += 1;
        }
      }
      if (grade.student.gender === "female") {
        female += 1;
      } else {
        male += 1;
      }
    });

    return {
      numberOfAvg: numberOfAvg,
      numberOfMale: male,
      numberOfFemale: female,
      numberOfGrade: grades.length,
      numberOfAvgMale: maleAvg,
      numberOfAvgFemale: femaleAvg,
    };
  },
};
