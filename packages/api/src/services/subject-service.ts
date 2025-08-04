import { db } from "@repo/db";

export const subjectService = {};

export function getPrograms({
  schoolId,
  schoolYearId,
  classroomId,
  staffId,
  categoryId,
}: {
  schoolId: string;
  schoolYearId: string;
  classroomId?: string;
  staffId?: string;
  categoryId?: string;
}) {
  return db.subject.findMany({
    where: {
      classroom: {
        schoolYearId: schoolYearId,
        schoolId: schoolId,
        ...(classroomId ? { id: classroomId } : {}),
      },
      ...(staffId ? { teacherId: staffId } : {}),
      ...(categoryId
        ? {
            programs: {
              some: {
                categoryId: categoryId,
              },
            },
          }
        : {}),
    },
    include: {
      classroom: {
        include: {
          level: true,
        },
      },
      course: true,
      teacher: true,
      programs: {
        include: {
          objectives: {
            include: {
              program: true,
            },
          },
        },
      },
      sessions: {
        include: {
          objectives: {
            include: {
              program: true,
            },
          },
        },
      },
    },
  });
}
