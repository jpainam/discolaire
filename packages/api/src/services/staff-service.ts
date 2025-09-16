import { db } from "../db";

export const staffService = {
  getFromUserId: async (userId: string) => {
    return db.staff.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
  },
  getClassrooms: async (staffId: string, schoolYearId: string) => {
    return _getClassrooms(staffId, schoolYearId);
  },
  getStudents: async (staffId: string, schoolYearId: string) => {
    const classrooms = await _getClassrooms(staffId, schoolYearId);
    const classroomIds = classrooms.map((c) => c.id);
    return db.student.findMany({
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
  },
};

function _getClassrooms(staffId: string, schoolYearId: string) {
  return db.classroom.findMany({
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
