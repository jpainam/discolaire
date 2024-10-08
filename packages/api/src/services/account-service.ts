import { db } from "@repo/db";

export const accountService = {
  attachAccount: async (studentId: string, name: string, createdBy: string) => {
    const studentAccount = await db.studentAccount.findFirst({
      where: {
        studentId: studentId,
      },
    });
    if (studentAccount) {
      return db.studentAccount.update({
        where: {
          id: studentAccount.id,
        },
        data: {
          name: name,
          updatedBy: createdBy,
        },
      });
    } else {
      return db.studentAccount.create({
        data: {
          studentId: studentId,
          name: name,
          createdBy: createdBy,
        },
      });
    }
  },
};
