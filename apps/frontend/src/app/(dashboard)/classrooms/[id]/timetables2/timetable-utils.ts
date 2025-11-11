import { addDays, isBefore, startOfDay } from "date-fns";

import type { RouterOutputs } from "@repo/api";

type EventColor = "sky" | "amber" | "violet" | "rose" | "emerald" | "orange";

function parseTimeStr(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
}

function atTime(d: Date, hour: number, minute: number) {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    hour,
    minute,
    0,
    0,
  );
}

/**
 * Generate weekly timetable events by iterating each day in [rangeStart, rangeEnd)
 * and matching rows whose weekday equals currentDate.getDay() (0=Sun..6=Sat).
 * Also clips by each row's [validFrom, validTo).
 */
export function buildEventsByDayScan(
  recurringRows: RouterOutputs["subjectTimetable"]["byClassroom"],
  rangeStart: Date,
  rangeEnd: Date,
) {
  const colors: EventColor[] = [
    "sky",
    "amber",
    "violet",
    "rose",
    "emerald",
    "orange",
  ];
  const colorMap = new Map<string, EventColor>();
  let colorIndex = 0;

  const events: {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    allDay: false;
    color: EventColor | undefined;
  }[] = [];
  let day = startOfDay(rangeStart);
  const hardEnd = startOfDay(rangeEnd); // exclusive

  while (isBefore(day, hardEnd)) {
    const jsDay = day.getDay(); // 0..6 Sun..Sat
    for (const row of recurringRows) {
      const rowDay = row.weekday % 7;
      if (rowDay !== jsDay) continue;

      const { hour: sh, minute: sm } = parseTimeStr(row.start);
      const { hour: eh, minute: em } = parseTimeStr(row.end);
      if (!sh || !eh || !sm || !em) {
        continue;
      }
      const eventStart = atTime(day, sh, sm);
      const eventEnd = atTime(day, eh, em);

      // color per course
      if (!colorMap.has(row.subject.course.id)) {
        colorMap.set(
          row.subject.course.id,
          colors[colorIndex % colors.length] ?? "sky",
        );
        colorIndex++;
      }

      events.push({
        id: `${row.id}-${eventStart.toISOString()}`,
        title: row.subject.course.shortName,
        description: "",
        start: eventStart,
        end: eventEnd,
        allDay: false,
        color: colorMap.get(row.subject.course.id),
      });
    }

    day = addDays(day, 1);
  }

  return events;
}
