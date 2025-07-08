/* eslint-disable @typescript-eslint/no-unused-vars */
import { addYears } from "date-fns";

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
            createdById: userId,
            schoolYearId: newYear.id,
          },
        });
        // fees
        const fees = await db.fee.findMany({
          where: {
            classroomId: cl.id,
          },
        });
        const allFees = fees.map(({ id, ...f }) => ({
          ...f,
          classroomId: cl.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: addYears(f.dueDate, 1),
        }));
        await db.fee.createMany({
          data: allFees,
        });
        // subjects
        const subjects = await db.subject.findMany({
          where: {
            classroomId: cl.id,
          },
        });
        const allSubjects = subjects.map(({ id, ...s }) => ({
          ...s,
          classroomId: cl.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        await db.subject.createMany({
          data: allSubjects,
        });
      }),
    );
    const terms = await db.term.findMany({
      where: {
        schoolYearId: prevSchoolYearId,
        schoolId: schoolId,
      },
    });
    const allTerms = terms.map(({ id, ...t }) => ({
      ...t,
      schoolYearId: newYear.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await db.term.createMany({
      data: allTerms,
    });
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
