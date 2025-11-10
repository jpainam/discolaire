"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { format, isSameDay } from "date-fns";
import { XIcon } from "lucide-react";

import type { CalendarEvent } from "~/components/event-calendar";
import { EventItem } from "~/components/event-calendar";

interface EventsPopupProps {
  date: Date;
  events: CalendarEvent[];
  position: { top: number; left: number };
  onClose: () => void;
  onEventSelect: (event: CalendarEvent) => void;
}

export function EventsPopup({
  date,
  events,
  position,
  onClose,
  onEventSelect,
}: EventsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // 1) Keep the adjusted position in state (OK to read in render)
  const [adjusted, setAdjusted] = useState(position);

  // 2) Recompute after mount/layout when we can read DOM sizes safely
  const recomputePosition = () => {
    const node = popupRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = position.left;
    let top = position.top;

    if (left + rect.width > vw) left = Math.max(0, vw - rect.width);
    if (top + rect.height > vh) top = Math.max(0, vh - rect.height);

    setAdjusted((prev) =>
      prev.left === left && prev.top === top ? prev : { left, top },
    );
  };

  // Run after layout so measurements are accurate and no flicker
  useLayoutEffect(() => {
    setAdjusted(position); // start from requested position
    // next frame, measure and clamp (ensures node is in the DOM)
    requestAnimationFrame(recomputePosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position.left, position.top, events.length]); // re-run when content/anchor changes

  // Keep updated on window resize
  useEffect(() => {
    const onResize = () => recomputePosition();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optional: observe size changes of the popup content itself
  useEffect(() => {
    if (!popupRef.current || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => recomputePosition());
    ro.observe(popupRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const node = popupRef.current;
      if (node && !node.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  const handleEventClick = (event: CalendarEvent) => {
    onEventSelect(event);
    onClose();
  };

  return (
    <div
      ref={popupRef}
      className="bg-background absolute z-50 max-h-96 w-80 overflow-auto rounded-md border shadow-lg"
      style={{ top: adjusted.top, left: adjusted.left }}
    >
      <div className="bg-background sticky top-0 flex items-center justify-between border-b p-3">
        <h3 className="font-medium">{format(date, "d MMMM yyyy")}</h3>
        <button
          onClick={onClose}
          className="hover:bg-muted rounded-full p-1"
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 p-3">
        {events.length === 0 ? (
          <div className="text-muted-foreground py-2 text-sm">No events</div>
        ) : (
          events.map((event) => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            const isFirstDay = isSameDay(date, eventStart);
            const isLastDay = isSameDay(date, eventEnd);

            return (
              <div
                key={event.id}
                className="cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <EventItem
                  event={event}
                  view="agenda"
                  isFirstDay={isFirstDay}
                  isLastDay={isLastDay}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
