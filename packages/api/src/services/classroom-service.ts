import _ from "lodash";

import { db } from "@repo/db";

async function get(classroomId: string, schoolId: string) {
  const classroom = await db.classroom.findUniqueOrThrow({
    where: {
      id: classroomId,
      schoolId: schoolId,
    },
    include: {
      level: true,
      cycle: true,
      schoolYear: true,
      section: true,
      classroomLeader: true,
      headTeacher: true,
      seniorAdvisor: true,
    },
  });
  const count = await getCount(classroomId);
  return {
    ...classroom,
    femaleCount: count.female,
    maleCount: count.male,
    size: count.size,
  };
}
async function getAll({
  schoolYearId,
  schoolId,
}: {
  schoolYearId: string;
  schoolId: string;
}) {
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
}

async function getCount(classroomId: string) {
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
}

async function getGradeSheets(classroomId: string) {
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
      num_is_absent: gradesheet.grades.filter((grade) => grade.isAbsent).length,
      max: Math.max(...grades.map((g) => g.grade)),
      min: Math.min(...grades.map((g) => g.grade)),
      avg: grades.length
        ? grades.reduce((acc, g) => acc + g.grade, 0) / grades.length
        : 0,
    };
  });
}
async function getMinMaxMoyGrades(classroomId: string) {
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
}
async function getSubjects(classroomId: string) {
  return db.subject.findMany({
    where: {
      classroomId: classroomId,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      course: {
        select: {
          id: true,
          shortName: true,
          name: true,
          color: true,
          reportName: true,
        },
      },
      subjectGroup: true,
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          prefix: true,
        },
      },
    },
  });
}
async function getStudents(classroomId: string) {
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
          schoolYearId: {
            lte: classroom.schoolYearId,
          },
        },
      },
    },
    orderBy: {
      lastName: "asc",
    },
    include: {
      formerSchool: true,
      user: true,
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

  // Check for repeating status
  const withIsRepeating = students.map((st) => {
    if (st.enrollments.length <= 1) {
      return {
        ...st,
        isRepeating: st.isRepeating,
      };
    }
    const currentEnrollement = st.enrollments.find(
      (enr) => enr.classroomId === classroomId,
    );
    const previousEnrollments = st.enrollments.filter(
      (enr) => enr.classroomId !== classroomId,
    );
    const isRepeating =
      previousEnrollments.filter(
        (prev) =>
          prev.classroom.levelId === currentEnrollement?.classroom.levelId,
      ).length > 0;

    return {
      ...st,
      isRepeating: isRepeating,
    };
  });

  return withIsRepeating;
}
async function addPermission({
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
}) {
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
      category: "user",
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
}

export const classroomService = {
  get,
  getAll,
  getCount,
  getGradeSheets,
  getMinMaxMoyGrades,
  getSubjects,
  getStudents,
  addPermission,
};
