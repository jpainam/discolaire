/* eslint-disable @typescript-eslint/no-unused-vars */
import { addYears } from "date-fns";

import { db } from "../db";

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
        isDefault: true,
      },
    });
    if (!prevSchoolYearId) {
      await db.schoolYear.update({
        where: {
          id: prevSchoolYearId,
        },
        data: {
          isDefault: false,
        },
      });
      return newYear;
    }
    // const schoolYear = await db.schoolYear.findUniqueOrThrow({
    //   where: {
    //     id: prevSchoolYearId,
    //   },
    // });
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
        const { id, classroomLeaderId, createdAt, updatedAt, ...rest } =
          classroom;
        const cl = await db.classroom.create({
          data: {
            ...rest,
            createdById: userId,
            schoolYearId: newYear.id,
          },
        });
        console.info(`Classroom ${cl.name} created`);
        // fees
        const fees = await db.fee.findMany({
          where: {
            classroomId: classroom.id,
          },
        });
        const allFees = fees.map(({ id, createdAt, updatedAt, ...f }) => ({
          ...f,
          classroomId: cl.id,
          dueDate: addYears(f.dueDate, 1),
        }));
        await db.fee.createMany({
          data: allFees,
        });
        console.info(`Fees for classroom ${cl.name} created`);
        // subjects
        const subjects = await db.subject.findMany({
          where: {
            classroomId: classroom.id,
          },
        });
        const allSubjects = subjects.map(({ id, ...s }) => ({
          ...s,
          classroomId: cl.id,
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
      startDate: addYears(t.startDate, 1),
      endDate: addYears(t.endDate, 1),
      schoolYearId: newYear.id,
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
