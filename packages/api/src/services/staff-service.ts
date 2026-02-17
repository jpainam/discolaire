import { addDays, isBefore, startOfDay } from "date-fns";

import type { PrismaClient } from "@repo/db";

const timetableColors = [
  "sky",
  "amber",
  "violet",
  "rose",
  "emerald",
  "orange",
] as const;

type TimetableColor = (typeof timetableColors)[number];

const timetableColorSet = new Set<string>(timetableColors);

function parseTimetableTime(time: string) {
  const [hourString, minuteString] = time.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
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

export class StaffService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }
  getFromUserId(userId: string) {
    return this.db.staff.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });
  }
  getSubjects(staffId: string, schoolYearId: string) {
    return this.db.subject.findMany({
      orderBy: {
        classroomId: "asc",
      },
      where: {
        teacherId: staffId,
        classroom: {
          //schoolId: ctx.schoolId,
          schoolYearId: schoolYearId,
        },
      },

      include: {
        _count: {
          select: {
            gradeSheets: true,
          },
        },
        teacher: true,
        subjectGroup: true,
        programs: true,
        timetables: true,
        course: true,
        classroom: {
          include: {
            headTeacher: true,
          },
        },
      },
    });
  }
  getClassrooms(staffId: string, schoolYearId: string) {
    return this.db.classroom.findMany({
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
  async getStudents(staffId: string, schoolYearId: string) {
    const classrooms = await this.getClassrooms(staffId, schoolYearId);
    const classroomIds = classrooms.map((c) => c.id);
    return this.db.student.findMany({
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
  }

  async getTimetables(staffId: string, schoolYearId: string) {
    const schoolYear = await this.db.schoolYear.findUniqueOrThrow({
      where: { id: schoolYearId },
    });

    const lessons = await this.db.subjectTimetable.findMany({
      include: {
        subject: {
          include: {
            course: true,
            classroom: {
              include: {
                _count: {
                  select: { enrollments: true },
                },
              },
            },
          },
        },
      },
      where: {
        subject: {
          teacherId: staffId,
          classroom: { schoolYearId },
        },
        validFrom: { lt: schoolYear.endDate },
        OR: [{ validTo: null }, { validTo: { gt: schoolYear.startDate } }],
      },
      orderBy: [{ weekday: "asc" }, { start: "asc" }],
    });

    // Group by weekday for efficient iteration
    const lessonsByWeekday = new Map<number, (typeof lessons)[number][]>();
    for (const lesson of lessons) {
      const weekday = normalizeWeekday(lesson.weekday);
      const list = lessonsByWeekday.get(weekday);
      if (list) {
        list.push(lesson);
      } else {
        lessonsByWeekday.set(weekday, [lesson]);
      }
    }

    // Build calendar events spanning the school year
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
        classroomId: string;
        classroomName: string;
        studentCount: number;
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
        if (!startTime || !endTime) continue;

        const eventStart = createDateAtTime(
          day,
          startTime.hour,
          startTime.minute,
        );
        const eventEnd = createDateAtTime(day, endTime.hour, endTime.minute);

        if (eventStart < lesson.validFrom) continue;
        if (lesson.validTo && eventStart >= lesson.validTo) continue;

        const rawColor = lesson.subject.course.color.toLowerCase();
        const courseId = lesson.subject.course.id;

        let color = courseColorMap.get(courseId);
        if (!color) {
          if (timetableColorSet.has(rawColor)) {
            color = rawColor as TimetableColor;
          } else {
            color =
              timetableColors[colorIndex % timetableColors.length] ?? "sky";
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
          location: lesson.subject.classroom.name,
          metadata: {
            timetableId: lesson.id,
            subjectId: lesson.subject.id,
            subjectName: lesson.subject.course.name,
            classroomId: lesson.subject.classroom.id,
            classroomName: lesson.subject.classroom.name,
            studentCount: lesson.subject.classroom._count.enrollments,
            occurrenceDate: eventStart.toISOString(),
          },
        });
      }

      day = addDays(day, 1);
    }

    return events;
  }
}
