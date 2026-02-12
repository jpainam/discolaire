"use client";

import { differenceInDays } from "date-fns";

import type { CalendarEvent } from "~/components/event-calendar";
import { EventItem } from "~/components/event-calendar";

interface DraggableEventProps {
  event: CalendarEvent;
  view: "month" | "week" | "day";
  showTime?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  height?: number;
  isMultiDay?: boolean;
  multiDayWidth?: number;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  "aria-hidden"?: boolean | "true" | "false";
}

export function DraggableEvent({
  event,
  view,
  showTime,
  onClick,
  height,
  isMultiDay,
  multiDayWidth,
  isFirstDay = true,
  isLastDay = true,
  "aria-hidden": ariaHidden,
}: DraggableEventProps) {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const isMultiDayEvent =
    isMultiDay ?? event.allDay ?? differenceInDays(eventEnd, eventStart) >= 1;

  const style = {
    height: height ?? "auto",
    width: isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
  };

  return (
    <div style={style}>
      <EventItem
        event={event}
        view={view}
        showTime={showTime}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        aria-hidden={ariaHidden}
      />
    </div>
  );
}
