/* eslint-disable @typescript-eslint/no-unused-vars */
import { addYears } from "date-fns";

import type { PrismaClient } from "@repo/db";

export class SchoolYearService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  async create({
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
  }) {
    const newYear = await this.db.schoolYear.create({
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
      await this.db.schoolYear.update({
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
    const classrooms = await this.db.classroom.findMany({
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
        const cl = await this.db.classroom.create({
          data: {
            ...rest,
            createdById: userId,
            schoolYearId: newYear.id,
          },
        });
        console.info(`Classroom ${cl.name} created`);
        // fees
        const fees = await this.db.fee.findMany({
          where: {
            classroomId: classroom.id,
          },
        });
        const allFees = fees.map(({ id, createdAt, updatedAt, ...f }) => ({
          ...f,
          classroomId: cl.id,
          dueDate: addYears(f.dueDate, 1),
        }));
        await this.db.fee.createMany({
          data: allFees,
        });
        console.info(`Fees for classroom ${cl.name} created`);
        // subjects
        const subjects = await this.db.subject.findMany({
          where: {
            classroomId: classroom.id,
          },
        });
        const allSubjects = subjects.map(({ id, ...s }) => ({
          ...s,
          classroomId: cl.id,
        }));
        await this.db.subject.createMany({
          data: allSubjects,
        });
      }),
    );
    const terms = await this.db.term.findMany({
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
    await this.db.term.createMany({
      data: allTerms,
    });
  }
  async getDefault(schoolId: string) {
    const schoolyear = await this.db.schoolYear.findFirst({
      where: {
        isDefault: true,
        schoolId: schoolId,
      },
    });
    if (!schoolyear) {
      return this.db.schoolYear.findFirst({
        where: {
          schoolId: schoolId,
        },
        orderBy: {
          startDate: "desc",
        },
      });
    }
    return schoolyear;
  }
}
