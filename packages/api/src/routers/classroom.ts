import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { addDays, isBefore, startOfDay } from "date-fns";
import { z } from "zod/v4";

import { TransactionStatus, TransactionType } from "@repo/db/enums";

import { protectedProcedure } from "../trpc";
import { buildPermissionIndex, checkPermission } from "../utils";

const createUpdateSchema = z.object({
  name: z.string().min(1),
  levelId: z.string(),
  cycleId: z.string(),
  sectionId: z.string(),
  reportName: z.string(),
  maxSize: z.coerce.number().int().positive(),
  seniorAdvisorId: z.string().min(1),
  headTeacherId: z.string().min(1),
});

const timetableColors = [
  "sky",
  "amber",
  "violet",
  "rose",
  "emerald",
  "orange",
] as const;

type TimetableColor = (typeof timetableColors)[number];

const timetableColorSet = new Set<TimetableColor>(timetableColors);

function parseTimetableTime(time: string) {
  const [hourString, minuteString] = time.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    return null;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
}

function createDateAtTime(day: Date, hour: number, minute: number) {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hour,
    minute,
    0,
    0,
  );
}

function normalizeWeekday(weekday: number) {
  return ((weekday % 7) + 7) % 7;
}
export const classroomRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const classrooms = await ctx.services.classroom.getAll({
      schoolYearId: ctx.schoolYearId,
      schoolId: ctx.session.user.schoolId,
    });
    if (ctx.session.user.profile === "student") {
      const student = await ctx.services.student.getFromUserId(
        ctx.session.user.id,
      );
      const classroom = await ctx.services.student.getClassroom(
        student.id,
        ctx.schoolYearId,
      );
      return classrooms.filter((cl) => cl.id === classroom?.id);
    }
    if (ctx.session.user.profile === "contact") {
      const contact = await ctx.services.contact.getFromUserId(
        ctx.session.user.id,
      );
      const classes = await ctx.services.contact.getClassrooms(
        contact.id,
        ctx.schoolYearId,
        ctx.schoolId,
      );
      const classesIds = classes.map((c) => c.id);
      return classrooms.filter((cl) => classesIds.includes(cl.id));
    }
    // Has access to classrooms where he teachers
    if (ctx.session.user.profile === "staff") {
      const permissionIndex = buildPermissionIndex(ctx.permissions);
      if (checkPermission("classroom.read", {}, permissionIndex)) {
        return classrooms;
      }
      const staff = await ctx.services.staff.getFromUserId(ctx.session.user.id);
      const classes = await ctx.services.staff.getClassrooms(
        staff.id,
        ctx.schoolYearId,
      );
      const classesIds = classes.map((c) => c.id);
      return classrooms.filter((cl) => classesIds.includes(cl.id));
    }
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not allowed to access this resource",
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      const classroomIds = Array.isArray(input) ? input : [input];
      await ctx.pubsub.publish("classroom", {
        type: "delete",
        data: {
          id: classroomIds.join(","),
        },
      });
      return ctx.db.classroom.deleteMany({
        where: {
          id: {
            in: classroomIds,
          },
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.services.classroom.get(input, ctx.schoolId);
  }),
  students: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ input, ctx }) => {
      const students = await ctx.services.classroom.getStudents(input);
      if (ctx.session.user.profile === "student") {
        return students.filter(
          (student) => student.userId === ctx.session.user.id,
        );
      } else if (ctx.session.user.profile === "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const studs = await ctx.services.contact.getStudents(contact.id);
        const studentIds = studs.map((s) => s.studentId);
        return students.filter((student) => studentIds.includes(student.id));
      }
      return students;
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const cl = await ctx.db.classroom.create({
        data: {
          name: input.name,
          levelId: input.levelId,
          reportName: input.reportName,
          schoolYearId: ctx.schoolYearId,
          cycleId: input.cycleId,
          sectionId: input.sectionId,
          schoolId: ctx.session.user.schoolId,
          maxSize: input.maxSize,
          seniorAdvisorId: input.seniorAdvisorId,
          headTeacherId: input.headTeacherId,
          createdById: ctx.session.user.id,
        },
      });
      await ctx.pubsub.publish("classroom", {
        type: "create",
        data: {
          id: cl.id,
          metadata: {
            name: cl.name,
          },
        },
      });
      return cl;
    }),

  subjects: protectedProcedure
    .input(z.string().min(1))
    .query(({ input, ctx }) => {
      return ctx.services.classroom.getSubjects(input);
    }),

  timetables: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ input, ctx }) => {
      const classroom = await ctx.db.classroom.findFirst({
        where: {
          id: input,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (!classroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Classroom not found",
        });
      }

      const subjects = await ctx.db.subject.findMany({
        where: {
          classroomId: classroom.id,
        },
        select: {
          id: true,
        },
      });

      if (subjects.length === 0) {
        return [];
      }

      const schoolYear = await ctx.db.schoolYear.findUniqueOrThrow({
        where: { id: ctx.schoolYearId },
      });

      const lessons = await ctx.db.subjectTimetable.findMany({
        include: {
          subject: {
            include: {
              teacher: true,
              course: true,
            },
          },
        },
        where: {
          subjectId: {
            in: subjects.map((subject) => subject.id),
          },
          validFrom: { lt: schoolYear.endDate },
          OR: [{ validTo: null }, { validTo: { gt: schoolYear.startDate } }],
        },
        orderBy: [{ weekday: "asc" }, { start: "asc" }],
      });

      const lessonsByWeekday = new Map<number, (typeof lessons)[number][]>();
      for (const lesson of lessons) {
        const weekday = normalizeWeekday(lesson.weekday);
        const lessonList = lessonsByWeekday.get(weekday);
        if (lessonList) {
          lessonList.push(lesson);
        } else {
          lessonsByWeekday.set(weekday, [lesson]);
        }
      }

      const courseColorMap = new Map<string, TimetableColor>();
      let colorIndex = 0;
      const events: {
        id: string;
        title: string;
        description: string;
        start: Date;
        end: Date;
        allDay: false;
        color: TimetableColor;
        location: string;
        metadata: {
          timetableId: number;
          subjectId: number;
          subjectName: string;
          teacherName: string | null;
          classroomId: string;
          classroomName: string;
          occurrenceDate: string;
        };
      }[] = [];

      let day = startOfDay(schoolYear.startDate);
      const hardEnd = startOfDay(schoolYear.endDate);

      while (isBefore(day, hardEnd)) {
        const dayLessons = lessonsByWeekday.get(day.getDay()) ?? [];

        for (const lesson of dayLessons) {
          const startTime = parseTimetableTime(lesson.start);
          const endTime = parseTimetableTime(lesson.end);
          if (!startTime || !endTime) {
            continue;
          }

          const eventStart = createDateAtTime(day, startTime.hour, startTime.minute);
          const eventEnd = createDateAtTime(day, endTime.hour, endTime.minute);

          if (eventStart < lesson.validFrom) {
            continue;
          }

          if (lesson.validTo && eventStart >= lesson.validTo) {
            continue;
          }

          const rawColor = lesson.subject.course.color.toLowerCase();
          const courseId = lesson.subject.course.id;

          let color = courseColorMap.get(courseId);
          if (!color) {
            if (timetableColorSet.has(rawColor as TimetableColor)) {
              color = rawColor as TimetableColor;
            } else {
              color = timetableColors[colorIndex % timetableColors.length] ?? "sky";
              colorIndex += 1;
            }
            courseColorMap.set(courseId, color);
          }

          events.push({
            id: `${lesson.id}-${eventStart.toISOString()}`,
            title: lesson.subject.course.shortName || lesson.subject.course.name,
            description: lesson.subject.course.name,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            color,
            location: classroom.name,
            metadata: {
              timetableId: lesson.id,
              subjectId: lesson.subject.id,
              subjectName: lesson.subject.course.name,
              teacherName: lesson.subject.teacher
                ? [
                    lesson.subject.teacher.prefix,
                    lesson.subject.teacher.lastName,
                    lesson.subject.teacher.firstName,
                  ]
                    .filter(Boolean)
                    .join(" ")
                : null,
              classroomId: classroom.id,
              classroomName: classroom.name,
              occurrenceDate: eventStart.toISOString(),
            },
          });
        }

        day = addDays(day, 1);
      }

      return events;
    }),

  fees: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.fee.findMany({
      where: {
        classroomId: input,
      },
      include: {
        classroom: true,
        journal: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  }),

  studentsBalance: protectedProcedure
    .input(z.string().min(1)) // classroomId
    .query(async ({ ctx, input }) => {
      let students = await ctx.services.classroom.getStudents(input);

      if (ctx.session.user.profile === "student") {
        students = students.filter(
          (student) => student.userId === ctx.session.user.id,
        );
      } else if (ctx.session.user.profile === "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const studs = await ctx.services.contact.getStudents(contact.id);
        const studentIds = studs.map((s) => s.studentId);
        students = students.filter((student) =>
          studentIds.includes(student.id),
        );
      }

      const studentIds = students.map((std) => std.id);
      const transactions = await ctx.db.transaction.findMany({
        where: {
          schoolYearId: ctx.schoolYearId,
          status: TransactionStatus.VALIDATED,
          deletedAt: null,
          student: {
            id: {
              in: studentIds,
            },
            enrollments: {
              some: {
                classroomId: input,
              },
            },
          },
        },
        orderBy: {
          student: {
            lastName: "asc",
          },
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      // Aggregate per (studentId, journalId)
      const balances: Record<string, Record<string, number>> = {};

      transactions.forEach((transaction) => {
        if (!transaction.journalId) return;

        const studentId = transaction.studentId;
        const journalId = transaction.journalId;

        balances[studentId] ??= {};
        balances[studentId][journalId] ??= 0;
        const delta =
          transaction.transactionType === TransactionType.DEBIT
            ? -transaction.amount
            : transaction.amount;

        balances[studentId][journalId] += delta;
      });

      const journals = await ctx.db.accountingJournal.findMany({
        where: {
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.session.user.schoolId,
        },
      });
      return students.map((student) => {
        const studentBalances = balances[student.id] ?? {};

        // const journalsBalances = Object.entries(studentBalances).map(
        //   ([journalId, balance]) => ({
        //     journalId,
        //     balance,
        //   }),
        // );

        // To include journals with zero balance, you could do:
        const journalsBalances = journals.map((journal) => ({
          journalId: journal.id,
          name: journal.name,
          balance: studentBalances[journal.id] ?? 0,
        }));

        return {
          ...student,
          studentId: student.id,
          journals: journalsBalances, // [{ journalId, balance }]
        };
      });
    }),
  teachers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.staff.findMany({
        orderBy: {
          lastName: "asc",
        },
        include: {
          user: true,
        },
        where: {
          subjects: {
            some: {
              classroomId: input,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.pubsub.publish("classroom", {
        type: "update",
        data: {
          id: input.id,
          metadata: {
            name: input.name,
          },
        },
      });
      return ctx.db.classroom.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          levelId: input.levelId,
          reportName: input.reportName,
          cycleId: input.cycleId,
          sectionId: input.sectionId,
          maxSize: input.maxSize,
          seniorAdvisorId: input.seniorAdvisorId,
          headTeacherId: input.headTeacherId,
        },
      });
    }),
  gradesheets: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return ctx.services.classroom.getGradeSheets(input);
    }),
  getMinMaxMoyGrades: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.services.classroom.getMinMaxMoyGrades(input);
    }),
  assignments: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return ctx.db.assignment.findMany({
        where: {
          classroomId: input,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          term: true,
          subject: {
            include: {
              course: true,
              teacher: true,
            },
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
