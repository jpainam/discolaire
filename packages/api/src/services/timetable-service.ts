import {
  addDays,
  eachWeekOfInterval,
  setHours,
  setMinutes,
  startOfWeek,
} from "date-fns";

interface Event {
  start: Date;
  end: Date;
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
