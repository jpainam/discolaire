import { db } from "@repo/db";

export async function grades_updates_1({
  gradesheetId,
}: {
  gradesheetId: number;
}) {
  const gradesheet = await db.gradeSheet.findFirstOrThrow({
    where: {
      id: gradesheetId,
    },
    include: {
      grades: true,
    },
  });
  const studentIds = gradesheet.grades.map((grade) => grade.studentId);
  const contacts = await db.studentContact.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
    },
  });
  console.log("contacts", contacts);
}
