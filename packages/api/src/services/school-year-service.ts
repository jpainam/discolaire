/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@repo/db";

export const schoolYearService = {
  create: async ({
    startDate,
    endDate,
    name,
    schoolId,
    isActive,
    prevSchoolYearId,
    userId,
  }: {
    startDate: Date;
    endDate: Date;
    name: string;
    schoolId: string;
    isActive?: boolean;
    prevSchoolYearId?: string;
    userId: string;
  }) => {
    const newYear = await db.schoolYear.create({
      data: {
        startDate,
        endDate,
        name,
        schoolId,
        isActive: isActive ?? true,
        enrollmentStartDate: startDate,
        enrollmentEndDate: endDate,
      },
    });
    if (!prevSchoolYearId) {
      return newYear;
    }
    const schoolYear = await db.schoolYear.findUniqueOrThrow({
      where: {
        id: prevSchoolYearId,
      },
    });
    // Classroom
    const classrooms = await db.classroom.findMany({
      where: {
        schoolYearId: prevSchoolYearId,
        schoolId: schoolId,
        deletedAt: null,
      },
    });
    await Promise.all(
      classrooms.map(async (classroom) => {
        const { id, classroomLeaderId, ...rest } = classroom;
        const cl = await db.classroom.create({
          data: {
            ...rest,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            schoolYearId: newYear.id,
          },
        });
      }),
    );
  },
  getDefault: async (schoolId: string) => {
    const schoolyear = await db.schoolYear.findFirst({
      where: {
        isDefault: true,
        schoolId: schoolId,
      },
    });
    if (!schoolyear) {
      return db.schoolYear.findFirst({
        where: {
          schoolId: schoolId,
        },
        orderBy: {
          startDate: "desc",
        },
      });
    }
    return schoolyear;
  },
};
