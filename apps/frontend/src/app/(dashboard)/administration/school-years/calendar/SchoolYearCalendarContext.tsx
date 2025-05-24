"use client";

import type { RouterOutputs } from "@repo/api";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface CalendarContextType {
  filters: string[];
  events: RouterOutputs["schoolYearEvent"]["all"];
  setFilters: (filters: string[]) => void;
  viewMode: "calendar" | "list";
  setViewMode: (view: "calendar" | "list") => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export function useSchoolYearCalendarContext() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider",
    );
  }
  return context;
}

interface CalendarProviderProps {
  children: ReactNode;
  events: RouterOutputs["schoolYearEvent"]["all"];
}

export function SchoolYearCalendarProvider({
  children,
  events,
}: CalendarProviderProps) {
  const [filters, setFilters] = useState([
    "holiday",
    "exam",
    "break",
    "event",
    "deadline",
    "other",
  ]);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  return (
    <CalendarContext.Provider
      value={{
        filters,
        setFilters,
        viewMode,
        setViewMode,
        currentYear,
        setCurrentYear,
        events: events,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
