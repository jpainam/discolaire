import { cn } from "@repo/ui/lib/utils";
import { isToday, startOfDay } from "date-fns";
import { useMemo } from "react";

import { EventBullet } from "~/components/calendar/month-view/event-bullet";
import { MonthEventBadge } from "~/components/calendar/month-view/month-event-badge";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { getMonthCellEvents } from "~/components/calendar/helpers";
import type { ICalendarCell, IEvent } from "~/components/calendar/interfaces";

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
    [date, events, eventPositions]
  );
  const isSunday = date.getDay() === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-l border-t py-1.5 lg:py-2",
        isSunday && "border-l-0"
      )}
    >
      <span
        className={cn(
          "h-6 px-1 text-xs font-semibold lg:px-2",
          !currentMonth && "opacity-20",
          isToday(date) &&
            "flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary-600 px-0 font-bold text-white"
        )}
      >
        {day}
      </span>

      <div
        className={cn(
          "flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0",
          !currentMonth && "opacity-50"
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
          <PopoverTrigger asChild>
            <button>
              <p
                className={cn(
                  "h-4.5 px-1.5 text-xs font-semibold text-t-quaternary",
                  !currentMonth && "opacity-50"
                )}
              >
                <span className="sm:hidden">
                  +{cellEvents.length - MAX_VISIBLE_EVENTS}
                </span>
                <span className="hidden sm:inline">
                  {" "}
                  {cellEvents.length - MAX_VISIBLE_EVENTS} more...
                </span>
              </p>
            </button>
          </PopoverTrigger>
          <PopoverContent>
            {Array.from({ length: cellEvents.length }).map((position) => {
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
