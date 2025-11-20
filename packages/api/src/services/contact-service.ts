import type { PrismaClient } from "@repo/db";

export class ContactService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }
  async getFromUserId(userId: string) {
    return this.db.contact.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
  }
  async getClassrooms(
    contactId: string,
    schoolYearId: string,
    schoolId: string,
  ) {
    const students = await this.db.studentContact.findMany({
      where: {
        contactId: contactId,
      },
    });
    const studentIds = students.map((s) => s.studentId);
    const enrollments = await this.db.enrollment.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
        schoolYearId: schoolYearId,
        classroom: {
          schoolYearId: schoolYearId,
          schoolId: schoolId,
        },
      },
      include: {
        classroom: true,
      },
    });

    return enrollments.map((e) => e.classroom);
  }
  async getStudents(contactId: string) {
    return this.db.studentContact.findMany({
      where: {
        contactId: contactId,
      },
      include: {
        contact: true,
        relationship: true,
      },
    });
  }
}
