import {
  addDays,
  eachWeekOfInterval,
  isBefore,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
} from "date-fns";

import type { PrismaClient } from "@repo/db";

interface Event {
  start: Date;
  end: Date;
}

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

export class TimetableService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async student({
    studentId,
    schoolId,
    schoolYearId,
  }: {
    studentId: string;
    schoolId: string;
    schoolYearId: string;
  }) {
    const classroom = await this.db.classroom.findFirst({
      where: {
        schoolId,
        enrollments: { some: { studentId, schoolYearId } },
      },
    });

    if (!classroom) {
      return [];
    }

    const schoolYear = await this.db.schoolYear.findUniqueOrThrow({
      where: { id: schoolYearId },
    });

    const lessons = await this.db.subjectTimetable.findMany({
      include: {
        subject: {
          include: {
            course: true,
          },
        },
      },
      where: {
        subject: {
          classroomId: classroom.id,
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
          id: `${lesson.id}-${eventStart.toISOString()}`,
          title: lesson.subject.course.shortName || lesson.subject.course.name,
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
  }
}

export const timetableService = {
  generateRange: ({
    startTime,
    endTime,
    dayOfWeek,
    startDate,
    finalDate,
  }: {
    startTime: string;
    startDate: Date;
    finalDate: Date;
    endTime: string;
    dayOfWeek: number;
  }) => {
    const events: Event[] = [];
    const weekRange = eachWeekOfInterval({ start: startDate, end: finalDate });
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    if (
      startHour == undefined ||
      endHour == undefined ||
      startMinute === undefined ||
      endMinute === undefined
    ) {
      console.error("Invalid time format", startTime, endTime);
      throw new Error("Invalid time format");
    }

    for (const week of weekRange) {
      const eventDay = addDays(
        startOfWeek(week, { weekStartsOn: 0 }),
        dayOfWeek,
      );
      if (eventDay >= startDate && eventDay <= finalDate) {
        const eventStartDateTime = setMinutes(
          setHours(eventDay, startHour),
          startMinute,
        );
        const eventEndDateTime = setMinutes(
          setHours(eventDay, endHour),
          endMinute,
        );
        events.push({
          start: eventStartDateTime,
          end: eventEndDateTime,
        });
      }
    }
    return events;
  },
};
