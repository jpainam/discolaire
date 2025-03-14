import { db } from "@repo/db";

export const contactService = {
  getFromUserId: async (userId: string) => {
    return db.contact.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
  },
  getClassrooms: async (userId: string, schoolYearId: string) => {
    const contact = await db.contact.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!contact) {
      return [];
    }
    const students = await db.studentContact.findMany({
      where: {
        contact: {
          userId: userId,
        },
      },
    });
    const studentIds = students.map((s) => s.studentId);
    const enrollments = await db.enrollment.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
        schoolYearId: schoolYearId,
        classroom: {
          schoolId: contact.schoolId,
        },
      },
      include: {
        classroom: true,
      },
    });
    return enrollments.map((e) => e.classroom);
  },
  getStudents: async (contactId: string) => {
    return db.studentContact.findMany({
      where: {
        contactId: contactId,
      },
      include: {
        contact: true,
        relationship: true,
      },
    });
  },
};
