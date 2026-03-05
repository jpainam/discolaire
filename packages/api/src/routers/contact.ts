import type { TRPCRouterRecord } from "@trpc/server";
import { addDays, isBefore, startOfDay, subMonths } from "date-fns";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";

import { ActivityAction, ActivityTargetType } from "../activity-logger";
import { protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  gender: z.enum(["male", "female"]).default("male"),
  isActive: z.boolean().default(true),
  observation: z.string().optional(),
  prefix: z.string().optional(),
  phoneNumber1: z.string().min(1),
  address: z.string().optional(),
  phoneNumber2: z.string().optional(),
  email: z.string().optional(),
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
export const contactRouter = {
  search: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(100),
          query: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const q = input?.query;
      const searchInclude = {
        user: true,
        studentContacts: {
          include: { student: true, relationship: true },
        },
      } as const;

      if (ctx.session.user.profile == "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const c = await ctx.db.contact.findUniqueOrThrow({
          include: searchInclude,
          where: { id: contact.id },
        });
        return [c];
      }
      if (ctx.session.user.profile == "student") {
        const student = await ctx.services.student.getFromUserId(
          ctx.session.user.id,
        );
        const studentContacts = await ctx.db.studentContact.findMany({
          where: { studentId: student.id },
        });
        const contactIds = studentContacts.map((sc) => sc.contactId);
        return ctx.db.contact.findMany({
          include: searchInclude,
          where: { id: { in: contactIds } },
        });
      }
      return ctx.db.contact.findMany({
        take: input?.limit ?? 100,
        orderBy: { createdAt: "desc" },
        include: searchInclude,
        where: {
          schoolId: ctx.schoolId,
          ...(q
            ? {
                OR: [
                  { firstName: { contains: q, mode: "insensitive" } },
                  { lastName: { contains: q, mode: "insensitive" } },
                  { phoneNumber1: { contains: q, mode: "insensitive" } },
                  { phoneNumber2: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                  { user: { email: { contains: q, mode: "insensitive" } } },
                  { employer: { contains: q, mode: "insensitive" } },
                  { occupation: { contains: q, mode: "insensitive" } },
                ],
              }
            : {}),
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      const contacts = await ctx.db.contact.findMany({
        where: {
          schoolId: ctx.schoolId,
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
      const userIds = contacts.map((c) => c.userId).filter((u) => u != null);
      if (userIds.length > 0) {
        await ctx.db.user.deleteMany({
          where: {
            id: {
              in: userIds,
            },
          },
        });
      }
      if (contacts.length > 0) {
        ctx.activityLog.logMany(
          contacts.map((contact) => {
            const name = `${contact.firstName} ${contact.lastName}`.trim();
            return {
              action: ActivityAction.DELETE,
              targetType: ActivityTargetType.CONTACT,
              targetId: contact.id,
              description: `${ctx.activityLog.actor} a supprimé le contact ${name}`,
              metadata: { entityName: name, actorName: ctx.activityLog.actor },
            };
          }),
        );
      }
      return ctx.db.contact.deleteMany({
        where: {
          schoolId: ctx.schoolId,
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  get: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      await ctx.db.contact.update({
        where: {
          id: input,
        },
        data: {
          lastAccessed: new Date(),
        },
      });
      return ctx.db.contact.findUniqueOrThrow({
        include: {
          user: true,
        },
        where: {
          id: input,
        },
      });
    }),

  classrooms: protectedProcedure
    .input(z.string().min(1))
    .query(({ ctx, input }) => {
      return ctx.services.contact.getClassrooms(
        input,
        ctx.schoolYearId,
        ctx.schoolId,
      );
    }),
  timetables: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const contact = await ctx.db.contact.findFirst({
        where: {
          id: input,
          schoolId: ctx.schoolId,
        },
        select: {
          id: true,
        },
      });

      if (!contact) {
        return [];
      }

      const studentLinks = await ctx.db.studentContact.findMany({
        where: {
          contactId: contact.id,
        },
        select: {
          studentId: true,
        },
      });

      if (studentLinks.length === 0) {
        return [];
      }

      const enrollments = await ctx.db.enrollment.findMany({
        where: {
          schoolYearId: ctx.schoolYearId,
          studentId: {
            in: studentLinks.map((studentLink) => studentLink.studentId),
          },
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
        include: {
          classroom: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const classroomMap = new Map<string, { id: string; name: string }>();
      for (const enrollment of enrollments) {
        classroomMap.set(enrollment.classroom.id, enrollment.classroom);
      }

      const classroomIds = [...classroomMap.keys()];
      if (classroomIds.length === 0) {
        return [];
      }

      const subjects = await ctx.db.subject.findMany({
        where: {
          classroomId: {
            in: classroomIds,
          },
        },
        select: {
          id: true,
          classroomId: true,
        },
      });

      if (subjects.length === 0) {
        return [];
      }

      const subjectClassroomMap = new Map<number, string>();
      for (const subject of subjects) {
        subjectClassroomMap.set(subject.id, subject.classroomId);
      }

      const schoolYear = await ctx.db.schoolYear.findUniqueOrThrow({
        where: { id: ctx.schoolYearId },
      });

      const lessons = await ctx.db.subjectTimetable.findMany({
        include: {
          subject: {
            include: {
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

          const eventStart = createDateAtTime(
            day,
            startTime.hour,
            startTime.minute,
          );
          const eventEnd = createDateAtTime(day, endTime.hour, endTime.minute);

          if (eventStart < lesson.validFrom) {
            continue;
          }

          if (lesson.validTo && eventStart >= lesson.validTo) {
            continue;
          }

          const classroomId = subjectClassroomMap.get(lesson.subjectId);
          if (!classroomId) {
            continue;
          }

          const classroom = classroomMap.get(classroomId);
          if (!classroom) {
            continue;
          }

          const rawColor = lesson.subject.course.color.toLowerCase();
          const courseId = lesson.subject.course.id;

          let color = courseColorMap.get(courseId);
          if (!color) {
            if (timetableColorSet.has(rawColor as TimetableColor)) {
              color = rawColor as TimetableColor;
            } else {
              color =
                timetableColors[colorIndex % timetableColors.length] ?? "sky";
              colorIndex += 1;
            }
            courseColorMap.set(courseId, color);
          }

          events.push({
            id: `${lesson.id}-${eventStart.toISOString()}-${classroom.id}`,
            title: `${lesson.subject.course.shortName || lesson.subject.course.name} (${classroom.name})`,
            description: lesson.subject.course.name,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            color,
            location: classroom.name,
          });
        }

        day = addDays(day, 1);
      }

      return events;
    }),
  getFromUserId: protectedProcedure
    .input(z.string().min(1))
    .query(({ input, ctx }) => {
      return ctx.services.contact.getFromUserId(input);
    }),
  students: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const std = await ctx.db.studentContact.findMany({
        where: {
          contactId: input,
        },
        include: {
          contact: {
            include: {
              user: true,
            },
          },
          relationship: true,
        },
      });
      const studentIds = std.map((s) => s.studentId);

      const students = await ctx.db.student.findMany({
        include: {
          user: true,
        },
        where: {
          id: {
            in: studentIds,
          },
        },
      });

      const result = await Promise.all(
        std.map(async (stud) => {
          const lastEnrollment = await ctx.db.enrollment.findFirst({
            where: {
              studentId: stud.studentId,
            },
            orderBy: {
              schoolYearId: "desc",
            },
          });
          const classroom = await ctx.db.classroom.findFirst({
            where: {
              enrollments: {
                some: {
                  id: lastEnrollment?.id,
                },
              },
            },
          });
          return {
            ...stud,
            student: {
              ...students.find((r) => r.id === stud.studentId),
              enrollment: lastEnrollment,
              classroom: classroom,
            },
          };
        }),
      );
      return result;
    }),
  count: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.contact.count({
      where: {
        schoolId: ctx.schoolId,
      },
    });
    const newContacts = await ctx.db.contact.count({
      where: {
        schoolId: ctx.schoolId,
        createdAt: { gte: subMonths(new Date(), 1) },
      },
    });
    return { total: result, new: newContacts };
  }),

  all: protectedProcedure
    .input(
      z.object({
        pageSize: z.number().int().min(1).max(200).optional().default(30),
        cursor: z.string().nullish(),
        search: z.string().optional().default(""),
        sorting: z
          .array(
            z.object({
              id: z.string().min(1),
              desc: z.boolean().optional().default(false),
            }),
          )
          .optional()
          .default([]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const contactInclude = {
        user: true,
        country: true,
        studentContacts: {
          include: { student: true, relationship: true },
        },
      } as const;

      if (ctx.session.user.profile == "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const c = await ctx.db.contact.findUniqueOrThrow({
          include: contactInclude,
          where: { id: contact.id },
        });
        return { data: [c], rowCount: 1, nextCursor: undefined };
      }

      if (ctx.session.user.profile == "student") {
        const student = await ctx.services.student.getFromUserId(
          ctx.session.user.id,
        );
        const studentContacts = await ctx.db.studentContact.findMany({
          where: { studentId: student.id },
        });
        const contactIds = studentContacts.map((sc) => sc.contactId);
        const contacts = await ctx.db.contact.findMany({
          include: contactInclude,
          where: { id: { in: contactIds } },
        });
        return {
          data: contacts,
          rowCount: contacts.length,
          nextCursor: undefined,
        };
      }

      const search = input.search.trim();

      const where: Prisma.ContactWhereInput = {
        schoolId: ctx.schoolId,
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { phoneNumber1: { contains: search, mode: "insensitive" } },
                { phoneNumber2: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { employer: { contains: search, mode: "insensitive" } },
                { occupation: { contains: search, mode: "insensitive" } },
                {
                  user: {
                    email: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      };

      const sortableFields = new Set([
        "firstName",
        "lastName",
        "createdAt",
        "employer",
        "occupation",
        "isActive",
      ]);

      const orderBy = input.sorting
        .filter((sort) => sortableFields.has(sort.id))
        .map((sort) => ({ [sort.id]: sort.desc ? "desc" : "asc" }));

      const resolvedOrderBy: Prisma.ContactOrderByWithRelationInput[] =
        orderBy.length > 0
          ? orderBy
          : [{ createdAt: "desc" }, { id: "desc" }];

      if (!resolvedOrderBy.some((order) => "id" in order)) {
        resolvedOrderBy.push({ id: "desc" });
      }

      const take = input.pageSize + 1;

      const [rowCount, data] = await ctx.db.$transaction([
        ctx.db.contact.count({ where }),
        ctx.db.contact.findMany({
          where,
          include: contactInclude,
          orderBy: resolvedOrderBy,
          take,
          ...(input.cursor
            ? { cursor: { id: input.cursor }, skip: 1 }
            : {}),
        }),
      ]);

      const hasNextPage = data.length > input.pageSize;
      const items = hasNextPage ? data.slice(0, -1) : data;
      const nextCursor = hasNextPage ? items[items.length - 1]?.id : undefined;

      return { data: items, rowCount, nextCursor };
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.db.contact.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          occupation: input.occupation,
          gender: input.gender,
          employer: input.employer,
          isActive: input.isActive,
          observation: input.observation,
          prefix: input.prefix,
          address: input.address,
          phoneNumber1: input.phoneNumber1,
          phoneNumber2: input.phoneNumber2,
          email: input.email,
          schoolId: ctx.schoolId,
        },
      });
      const contactName = `${contact.firstName} ${contact.lastName}`.trim();
      ctx.activityLog.log({
        action: ActivityAction.CREATE,
        targetType: ActivityTargetType.CONTACT,
        targetId: contact.id,
        description: `${ctx.activityLog.actor} a créé le contact <a href="/contacts/${contact.id}">${contactName}</a>`,
        metadata: { entityName: contactName, actorName: ctx.activityLog.actor },
      });
      return contact;
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.db.contact.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          occupation: input.occupation,
          employer: input.employer,
          isActive: input.isActive,
          observation: input.observation,
          prefix: input.prefix,
          address: input.address,
          email: input.email,
          phoneNumber1: input.phoneNumber1,
          phoneNumber2: input.phoneNumber2,
        },
      });
      const updatedName = `${contact.firstName} ${contact.lastName}`.trim();
      ctx.activityLog.log({
        action: ActivityAction.UPDATE,
        targetType: ActivityTargetType.CONTACT,
        targetId: contact.id,
        description: `${ctx.activityLog.actor} a modifié les informations du contact <a href="/contacts/${contact.id}">${updatedName}</a>`,
        metadata: { entityName: updatedName, actorName: ctx.activityLog.actor },
      });
      return contact;
    }),
  unlinkedStudents: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        page: z.number().optional().default(1),
        q: z.string().optional(),
        contactId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const qq = `%${input.q}%`;
      return ctx.db.student.findMany({
        take: input.limit,
        orderBy: {
          lastName: "asc",
        },
        include: {
          user: true,
        },
        where: {
          schoolId: ctx.schoolId,
          AND: [
            {
              OR: [
                { firstName: { startsWith: qq, mode: "insensitive" } },
                { lastName: { startsWith: qq, mode: "insensitive" } },
                { residence: { startsWith: qq, mode: "insensitive" } },
                { phoneNumber: { startsWith: qq, mode: "insensitive" } },
                { registrationNumber: { startsWith: qq, mode: "insensitive" } },
              ],
            },
            {
              studentContacts: {
                none: {
                  contactId: input.contactId,
                },
              },
            },
          ],
        },
      });
    }),
  documents: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return ctx.db.document.findMany({
        where: {
          contactId: input,
        },
        include: {
          createdBy: true,
          contact: true,
        },
      });
    }),
  transactions: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const students = await ctx.services.contact.getStudents(input);
      return ctx.db.transaction.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          student: true,
          journal: true,
        },
        where: {
          studentId: {
            in: students.map((st) => st.studentId),
          },
        },
      });
    }),
  activities: protectedProcedure
    .input(
      z.object({
        contactId: z.string().min(1),
        limit: z.number().min(1).max(100).optional().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const logs = await ctx.db.logActivity.findMany({
        where: {
          schoolId: ctx.schoolId,
          targetType: "contact",
          targetId: input.contactId,
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });
      return ctx.services.logActivity.formatLogActivities(logs);
    }),
  studentOverview: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const students = await ctx.services.contact.getStudents(input);
      return await Promise.all(
        students.map(async (st) => {
          const trans = await ctx.services.student.getOverallBalance({
            studentId: st.studentId,
          });

          const stud = await ctx.services.student.get(
            st.studentId,
            ctx.schoolYearId,
            ctx.schoolId,
          );
          return {
            student: stud,
            ...trans,
          };
        }),
      );
    }),
  stats: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const students = await ctx.services.contact.getStudents(input);
    let balance = 0;
    for (const std of students) {
      const g = await ctx.services.student.getOverallBalance({
        studentId: std.studentId,
      });
      balance += g.balance;
    }

    const grades = await ctx.db.grade.findMany({
      where: {
        studentId: {
          in: students.map((s) => s.studentId),
        },
        isAbsent: false,
        gradeSheet: {
          term: {
            schoolYearId: ctx.schoolYearId,
          },
        },
      },
    });
    return {
      students: students.length,
      balance: balance,
      grade: grades.length,
    };
  }),

  notificationPreferences: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const recipient = await ctx.services.notification.ensureRecipient({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: input,
          profile: "contact",
        },
      });
      return ctx.db.notificationPreference.findMany({
        where: {
          recipientId: recipient.id,
        },
      });
    }),
} satisfies TRPCRouterRecord;
