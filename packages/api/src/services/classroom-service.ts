import _ from "lodash";

import { db } from "@repo/db";

export const classroomService = {
  getAll: async ({
    schoolYearId,
    schoolId,
  }: {
    schoolYearId: string;
    schoolId: string;
  }) => {
    const classroomsWithStats = await db.classroom.findMany({
      orderBy: {
        levelId: "asc",
      },
      where: {
        schoolYearId: schoolYearId,
        schoolId: schoolId,
      },
      include: {
        level: true,
        cycle: true,
        section: true,
        classroomLeader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        headTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        seniorAdvisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        enrollments: {
          select: {
            student: {
              select: {
                gender: true,
              },
            },
          },
        },
      },
    });

    const classroomsWithSize = classroomsWithStats.map((c) => {
      const totalStudents = c.enrollments.length;
      const femaleCount = c.enrollments.filter(
        (e) => e.student.gender === "female",
      ).length;
      const maleCount = c.enrollments.filter(
        (e) => e.student.gender === "male",
      ).length;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { enrollments, ...classroomWithoutEnrollments } = c;
      return {
        ...classroomWithoutEnrollments,
        size: totalStudents,
        femaleCount,
        maleCount,
      };
    });
    return classroomsWithSize;
  },
  getCount: async (classroomId: string) => {
    const enrollments = await db.enrollment.findMany({
      where: {
        classroomId: classroomId,
      },
      include: {
        student: true,
      },
    });

    const maleCount = enrollments.filter(
      (enrollment) => enrollment.student.gender === "male",
    ).length;
    const femaleCount = enrollments.filter(
      (enrollment) => enrollment.student.gender === "female",
    ).length;
    return {
      male: maleCount,
      female: femaleCount,
      size: enrollments.length,
    };
  },
  getGradeSheets: async (classroomId: string) => {
    const gradesheets = await db.gradeSheet.findMany({
      include: {
        term: true,
        grades: true,
        subject: {
          include: {
            teacher: true,
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        subject: {
          classroomId: classroomId,
        },
      },
    });

    return gradesheets.map((gradesheet) => {
      const grades = gradesheet.grades.filter((grade) => !grade.isAbsent);
      return {
        ...gradesheet,
        num_grades: grades.length,
        num_is_absent: gradesheet.grades.filter((grade) => grade.isAbsent)
          .length,
        max: Math.max(...grades.map((g) => g.grade)),
        min: Math.min(...grades.map((g) => g.grade)),
        avg: grades.length
          ? grades.reduce((acc, g) => acc + g.grade, 0) / grades.length
          : 0,
      };
    });
  },
  getMinMaxMoyGrades: async (classroomId: string) => {
    const gradeAggregation = await db.grade.groupBy({
      by: ["gradeSheetId"],
      where: {
        gradeSheet: {
          subject: {
            classroomId: classroomId,
          },
        },
      },
      _min: {
        grade: true,
      },
      _max: {
        grade: true,
      },
      _avg: {
        grade: true,
      },
    });
    const gradesheets = await db.gradeSheet.findMany({
      include: {
        subject: true,
      },
      where: {
        subject: {
          classroomId: classroomId,
        },
      },
    });
    const gradesheetMap = _.keyBy(gradesheets, "id");
    const result = gradeAggregation.map((grade) => {
      const gr = gradesheetMap[grade.gradeSheetId];
      return {
        min: grade._min.grade,
        max: grade._max.grade,
        avg: grade._avg.grade,
        gradeSheetId: grade.gradeSheetId,
        weight: gr?.weight,
        subjectId: gr?.subjectId,
        termId: gr?.termId,
        name: gr?.name,
        coefficient: gr?.subject.coefficient,
      };
    });
    return result;
  },
  getSubjects: async (classroomId: string) => {
    return db.subject.findMany({
      where: {
        classroomId: classroomId,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        course: true,
        subjectGroup: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },
  getStudents: async (classroomId: string) => {
    const classroom = await db.classroom.findUnique({
      where: {
        id: classroomId,
      },
    });
    if (!classroom) {
      throw new Error("Classroom not found");
    }
    const students = await db.student.findMany({
      where: {
        enrollments: {
          some: {
            classroomId: classroomId,
          },
        },
      },
      orderBy: {
        lastName: "asc",
      },
      include: {
        formerSchool: true,
        enrollments: {
          include: {
            classroom: true,
            schoolYear: true,
          },
        },
        religion: true,
        studentContacts: {
          include: {
            contact: true,
          },
        },
      },
    });
    const studentIds = students.map((st) => st.id);

    const previousEnrollments = await db.enrollment.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
        schoolYearId: {
          lt: classroom.schoolYearId,
        },
      },
      select: {
        studentId: true,
        classroom: {
          select: {
            schoolYearId: true,
            levelId: true,
          },
        },
      },
    });

    // Check for repeating status
    const withIsRepeating = students.map((st) => {
      const currentEnrollement = st.enrollments.find(
        (enr) => enr.classroomId === classroomId,
      );
      const isRepeating =
        previousEnrollments.filter(
          (prev) =>
            prev.studentId === st.id &&
            prev.classroom.levelId === currentEnrollement?.classroom.levelId,
        ).length > 0;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { enrollments, ...studentWithoutEnrollments } = st;
      return {
        ...studentWithoutEnrollments,
        isRepeating,
      };
    });

    return withIsRepeating;
  },
  addPermission: async ({
    userId,
    resources,
    classroomId,
    schoolId,
    byId,
  }: {
    userId: string;
    resources: string[];
    byId: string;
    schoolId: string;
    classroomId: string;
  }) => {
    const policyName = `${userId}-classroom-${classroomId}`;

    const existingPolicy = await db.policy.findFirst({
      where: { name: policyName },
    });

    if (existingPolicy) {
      return existingPolicy;
    }
    return db.policy.create({
      data: {
        name: policyName,
        actions: ["read:Read"],
        effect: "Allow",
        createdById: byId,
        resources: resources,
        condition: {
          in: [{ var: "id" }, [classroomId]],
        },
        schoolId: schoolId,
        users: {
          create: {
            userId: userId,
            createdById: byId,
          },
        },
      },
    });
  },
};
