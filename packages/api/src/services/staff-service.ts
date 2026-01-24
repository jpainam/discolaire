import type { PrismaClient } from "@repo/db";

export class StaffService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }
  getFromUserId(userId: string) {
    return this.db.staff.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
  }
  getSubjects(staffId: string, schoolYearId: string) {
    return this.db.subject.findMany({
      orderBy: {
        classroomId: "asc",
      },
      where: {
        teacherId: staffId,
        classroom: {
          //schoolId: ctx.schoolId,
          schoolYearId: schoolYearId,
        },
      },

      include: {
        _count: {
          select: {
            gradeSheets: true,
          },
        },
        teacher: true,
        subjectGroup: true,
        programs: true,
        timetables: true,
        course: true,
        classroom: {
          include: {
            headTeacher: true,
          },
        },
      },
    });
  }
  getClassrooms(staffId: string, schoolYearId: string) {
    return this.db.classroom.findMany({
      where: {
        OR: [
          {
            headTeacherId: staffId,
          },
          {
            seniorAdvisorId: staffId,
          },
          {
            subjects: {
              some: {
                teacherId: staffId,
              },
            },
          },
        ],
        schoolYearId: schoolYearId,
      },
    });
  }
  async getStudents(staffId: string, schoolYearId: string) {
    const classrooms = await this.getClassrooms(staffId, schoolYearId);
    const classroomIds = classrooms.map((c) => c.id);
    return this.db.student.findMany({
      where: {
        enrollments: {
          some: {
            classroomId: {
              in: classroomIds,
            },
            schoolYearId: schoolYearId,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userId: true,
      },
    });
  }
}
