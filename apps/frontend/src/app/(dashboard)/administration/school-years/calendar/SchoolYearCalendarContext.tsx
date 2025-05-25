"use client";

import type { RouterOutputs } from "@repo/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { useTRPC } from "~/trpc/react";

interface CalendarContextType {
  filters: string[];
  events: RouterOutputs["schoolYearEvent"]["all"];
  eventTypes: RouterOutputs["schoolYearEvent"]["eventTypes"];
  setFilters: (filters: string[]) => void;
  viewMode: "calendar" | "list";
  setViewMode: (view: "calendar" | "list") => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export function useSchoolYearCalendarContext() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }
  return context;
}

interface CalendarProviderProps {
  children: ReactNode;
}

export function SchoolYearCalendarProvider({
  children,
}: CalendarProviderProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const trpc = useTRPC();
  const { data: events } = useSuspenseQuery(
    trpc.schoolYearEvent.all.queryOptions()
  );
  const { data: eventTypes } = useSuspenseQuery(
    trpc.schoolYearEvent.eventTypes.queryOptions()
  );
  const [filters, setFilters] = useState(eventTypes.map((event) => event.id));

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
        eventTypes: eventTypes,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
