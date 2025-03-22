/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";

import { createContext, useContext, useState } from "react";

import type { IEvent, IUser } from "./interfaces";
import type { TCalendarView } from "./types";

interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  view: TCalendarView;
  setView: (view: TCalendarView) => void;

  selectedUserId: IUser["id"] | "all";
  setSelectedUserId: (userId: IUser["id"] | "all") => void;
  badgeVariant: "dot" | "colored";
  setBadgeVariant: (variant: "dot" | "colored") => void;
  users: IUser[];
  events: IEvent[];
}

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
  children,
  users,
  events,
}: {
  children: React.ReactNode;
  users: IUser[];
  events: IEvent[];
}) {
  const [badgeVariant, setBadgeVariant] = useState<"dot" | "colored">("dot");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<IUser["id"] | "all">(
    "all",
  );

  const [view, setView] = useState<TCalendarView>("week");

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        view,
        setView,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant,
        setBadgeVariant,
        users,
        events,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
