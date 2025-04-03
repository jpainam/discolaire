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
    daysOfWeek,
    startDate,
    finalDate,
  }: {
    startTime: string;
    startDate: Date;
    finalDate: Date;
    endTime: string;
    daysOfWeek: number[];
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
      for (const day of daysOfWeek) {
        const eventDay = addDays(startOfWeek(week, { weekStartsOn: 0 }), day);
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
    }
    return events;
  },
};
