import { useMemo } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";

import type { IEvent } from "~/components/calendar/interfaces";
import { useCalendar } from "~/components/calendar/calendar-context";
import {
  calculateMonthEventPositions,
  getCalendarCells,
} from "~/components/calendar/helpers";
import { DayCell } from "~/components/calendar/month-view/day-cell";
import { useLocale } from "~/i18n";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarMonthView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useCalendar();
  const { i18n } = useLocale();
  const start = startOfWeek(new Date());
  const WEEK_DAYS = Array.from({ length: 7 }, (_, i) =>
    format(addDays(start, i), "EEE", {
      locale: i18n.language == "fr" ? fr : i18n.language == "en" ? enUS : es,
    }),
  ); //["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const allEvents = [...multiDayEvents, ...singleDayEvents];

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDayEvents,
        singleDayEvents,
        selectedDate,
      ),
    [multiDayEvents, singleDayEvents, selectedDate],
  );

  return (
    <div>
      <div className="grid grid-cols-7 divide-x">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="flex items-center justify-center py-2">
            <span className="text-t-quaternary text-xs font-medium">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 overflow-hidden">
        {cells.map((cell) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            events={allEvents}
            eventPositions={eventPositions}
          />
        ))}
      </div>
    </div>
  );
}
