"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { differenceInDays } from "date-fns";

import type { CalendarEvent } from "~/components/event-calendar";
import { EventItem, useCalendarDnd } from "~/components/event-calendar";

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
  const { activeId } = useCalendarDnd();

  // DOM node ref (write-only during render; reads only in effects/handlers)
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Where inside the event the user grabbed
  const [dragHandlePosition, setDragHandlePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Measured height (safe to read in render)
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  // Compute once per render (doesn't touch refs)
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const isMultiDayEvent =
    isMultiDay ?? event.allDay ?? differenceInDays(eventEnd, eventStart) >= 1;

  // Measure height after mount/layout
  useLayoutEffect(() => {
    if (!elementRef.current) return;
    setMeasuredHeight(elementRef.current.offsetHeight);
  }, [view, event.id, height]);

  // Keep height updated on resize
  useEffect(() => {
    if (!elementRef.current || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      if (elementRef.current) {
        setMeasuredHeight(elementRef.current.offsetHeight);
      }
    });
    ro.observe(elementRef.current);
    return () => ro.disconnect();
  }, []);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${event.id}-${view}`,
      // IMPORTANT: use state/props only; no ref reads here
      data: {
        event,
        view,
        height: height ?? measuredHeight ?? null,
        isMultiDay: isMultiDayEvent,
        multiDayWidth,
        dragHandlePosition,
        isFirstDay,
        isLastDay,
      },
    });

  const handleMouseDown = (e: React.MouseEvent) => {
    // It’s okay to read refs in event handlers
    const node = elementRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setDragHandlePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const node = elementRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const touch = e.touches[0];
    if (touch)
      setDragHandlePosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
  };

  // Hide the original while dragging
  if (isDragging || activeId === `${event.id}-${view}`) {
    return (
      <div
        ref={setNodeRef}
        className="opacity-0"
        style={{ height: height ?? "auto" }}
      />
    );
  }

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        height: height ?? measuredHeight ?? "auto",
        width:
          isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
      }
    : {
        height: height ?? measuredHeight ?? "auto",
        width:
          isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
      };

  // Single callback ref that wires both dnd-kit and our local ref
  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    elementRef.current = node; // write is fine during render
  };

  return (
    <div ref={combinedRef} style={style} className="touch-none">
      <EventItem
        event={event}
        view={view}
        showTime={showTime}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        dndListeners={listeners}
        dndAttributes={attributes}
        aria-hidden={ariaHidden}
      />
    </div>
  );
}
