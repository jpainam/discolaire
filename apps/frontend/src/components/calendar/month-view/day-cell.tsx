import { useMemo } from "react";
import { isToday, startOfDay } from "date-fns";
import i18next from "i18next";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/utils";

import type { ICalendarCell, IEvent } from "~/components/calendar/interfaces";
import { getMonthCellEvents } from "~/components/calendar/helpers";
import { EventBullet } from "~/components/calendar/month-view/event-bullet";
import { MonthEventBadge } from "~/components/calendar/month-view/month-event-badge";

interface IProps {
  cell: ICalendarCell;
  events: IEvent[];
  eventPositions: Record<string, number>;
}

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({ cell, events, eventPositions }: IProps) {
  const { day, currentMonth, date } = cell;

  const cellEvents = useMemo(
    () => getMonthCellEvents(date, events, eventPositions),
    [date, events, eventPositions],
  );
  const isSunday = date.getDay() === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-t border-l py-1",
        isSunday && "border-l-0",
      )}
    >
      <span
        className={cn(
          "h-6 px-1 text-xs font-semibold lg:px-2",
          !currentMonth && "opacity-20",
          isToday(date) &&
            "bg-primary-600 flex w-6 translate-x-1 items-center justify-center rounded-full px-0 font-bold text-white",
        )}
      >
        {day}
      </span>

      <div
        className={cn(
          "flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0",
          !currentMonth && "opacity-50",
        )}
      >
        {[0, 1, 2].map((position) => {
          const event = cellEvents.find((e) => e.position === position);
          const eventKey = event
            ? `event-${event.id}-${position}`
            : `empty-${position}`;

          return (
            <div key={eventKey} className="lg:flex-1">
              {event && (
                <>
                  <EventBullet className="lg:hidden" color={event.color} />
                  <MonthEventBadge
                    className="hidden lg:flex"
                    event={event}
                    cellDate={startOfDay(date)}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {cellEvents.length > MAX_VISIBLE_EVENTS && (
        <Popover>
          <PopoverTrigger asChild className="">
            <button>
              <p
                className={cn(
                  "text-t-quaternary flex h-4.5 items-start px-1.5 text-xs font-semibold",
                  !currentMonth && "opacity-50",
                )}
              >
                <span className="sm:hidden">
                  +{cellEvents.length - MAX_VISIBLE_EVENTS}
                </span>
                <span className="hidden sm:inline">
                  + {cellEvents.length - MAX_VISIBLE_EVENTS} more...
                </span>
              </p>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "flex gap-1 p-2 lg:flex-col lg:gap-2 lg:px-0",
              !currentMonth && "opacity-50",
            )}
          >
            <div className="px-2 text-xs">
              {date.toLocaleDateString(i18next.language, {
                weekday: "short",
                day: "2-digit",
              })}
            </div>
            {Array.from({ length: cellEvents.length }).map((_, position) => {
              const event = cellEvents.find((e) => e.position === position);
              const eventKey = event
                ? `event-${event.id}-${position}-2`
                : `empty-${position}-2`;

              return (
                <div key={eventKey} className="lg:flex-1">
                  {event && (
                    <>
                      <EventBullet className="lg:hidden" color={event.color} />
                      <MonthEventBadge
                        className="hidden lg:flex"
                        event={event}
                        cellDate={startOfDay(date)}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
