"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

import type { CalendarEvent } from "./types";

interface CalendarContextType {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  setEvents: (events: CalendarEvent[]) => void;
  events: CalendarEvent[];
}

const CalendarContext = createContext<CalendarContextType>({
  currentDate: new Date(),
  events: [],
  setCurrentDate: () => {
    /* empty */
  },
  setEvents: () => {
    /* */
  },
});

export const useCalendar = () => useContext(CalendarContext);

export function EventCalendarProvider({
  children,
  events,
}: PropsWithChildren<{ events: CalendarEvent[] }>) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [allEvent, setEvents] = useState<CalendarEvent[]>(events);

  return (
    <CalendarContext.Provider
      value={{
        currentDate: currentDate,
        setCurrentDate,
        events: allEvent,
        setEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
