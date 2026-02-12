"use client";

import type {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
} from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CalendarEvent, CalendarView } from "./types";

interface CalendarContextType {
  currentDate: Date;
  events: CalendarEvent[];
  view: CalendarView;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  setView: Dispatch<SetStateAction<CalendarView>>;
}

interface EventCalendarProviderProps {
  events?: CalendarEvent[];
  initialEvents?: CalendarEvent[];
  currentDate?: Date;
  initialDate?: Date;
  view?: CalendarView;
  initialView?: CalendarView;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onEventsChange?: (events: CalendarEvent[]) => void;
  onCurrentDateChange?: (currentDate: Date) => void;
  onViewChange?: (view: CalendarView) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

const resolveValue = <T,>(next: SetStateAction<T>, previous: T): T => {
  if (typeof next === "function") {
    return (next as (previous: T) => T)(previous);
  }
  return next;
};

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
  controlled = value !== undefined,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
  controlled?: boolean;
}): [T, Dispatch<SetStateAction<T>>] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlled;
  const state = (isControlled ? value : internalValue) as T;

  useEffect(() => {
    if (!isControlled && value !== undefined) {
      setInternalValue(value);
    }
  }, [isControlled, value]);

  const setState = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      if (isControlled) {
        const nextValue = resolveValue(next, value as T);
        onChange?.(nextValue);
        return;
      }

      setInternalValue((previous) => {
        const nextValue = resolveValue(next, previous);
        onChange?.(nextValue);
        return nextValue;
      });
    },
    [isControlled, onChange, value],
  );

  return [state, setState];
}

export const useCalendar = () => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error("useCalendar must be used inside EventCalendarProvider");
  }

  return context;
};

export function EventCalendarProvider({
  children,
  events: controlledEvents,
  initialEvents = [],
  currentDate: controlledCurrentDate,
  initialDate,
  view: controlledView,
  initialView = "month",
  weekStartsOn = 1,
  onEventsChange,
  onCurrentDateChange,
  onViewChange,
}: PropsWithChildren<EventCalendarProviderProps>) {
  const [events, setEvents] = useControllableState<CalendarEvent[]>({
    value: controlledEvents,
    defaultValue: controlledEvents ?? initialEvents,
    onChange: onEventsChange,
    controlled: controlledEvents !== undefined && onEventsChange !== undefined,
  });

  const [currentDate, setCurrentDate] = useControllableState<Date>({
    value: controlledCurrentDate,
    defaultValue: controlledCurrentDate ?? initialDate ?? new Date(),
    onChange: onCurrentDateChange,
    controlled:
      controlledCurrentDate !== undefined && onCurrentDateChange !== undefined,
  });

  const [view, setView] = useControllableState<CalendarView>({
    value: controlledView,
    defaultValue: controlledView ?? initialView,
    onChange: onViewChange,
    controlled: controlledView !== undefined && onViewChange !== undefined,
  });

  const contextValue = useMemo<CalendarContextType>(
    () => ({
      currentDate,
      events,
      view,
      weekStartsOn,
      setCurrentDate,
      setEvents,
      setView,
    }),
    [currentDate, events, setCurrentDate, setEvents, setView, view, weekStartsOn],
  );

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
}
