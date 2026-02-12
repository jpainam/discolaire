"use client";

import { useState } from "react";

import type { CalendarEvent, CalendarView } from "~/components/event-calendar";
import {
  EventCalendar,
  EventCalendarProvider,
} from "~/components/event-calendar";

const buildDate = (day: number, hour: number, minute = 0) =>
  new Date(2024, 0, day, hour, minute, 0, 0);

const startOfDay = (day: number) => new Date(2024, 0, day, 0, 0, 0, 0);

const createInitialEvents = (): CalendarEvent[] => [
  {
    id: "mlk-day",
    title: "Martin Luther King Day",
    start: startOfDay(15),
    end: startOfDay(15),
    allDay: true,
    color: "sky",
  },
  {
    id: "coastal-retreat",
    title: "Coastal Family Retreat",
    start: startOfDay(20),
    end: startOfDay(20),
    allDay: true,
    color: "amber",
  },
  {
    id: "morning-run",
    title: "Morning Run",
    start: buildDate(15, 7, 0),
    end: buildDate(15, 8, 0),
    color: "amber",
  },
  {
    id: "quarterly-review",
    title: "Quarterly Review",
    start: buildDate(15, 9, 0),
    end: buildDate(15, 11, 0),
    color: "rose",
  },
  {
    id: "design-team-kickoff",
    title: "Design Team Kickoff",
    start: buildDate(15, 10, 0),
    end: buildDate(15, 11, 30),
    color: "violet",
  },
  {
    id: "q1-strategy",
    title: "Q1 Strategy Meeting",
    start: buildDate(15, 13, 0),
    end: buildDate(15, 14, 30),
    color: "sky",
  },
  {
    id: "architecture-planning",
    title: "Architecture Planning",
    start: buildDate(15, 15, 0),
    end: buildDate(15, 16, 30),
    color: "emerald",
  },
  {
    id: "customer-feedback",
    title: "Customer Feedback Review",
    start: buildDate(16, 9, 30),
    end: buildDate(16, 11, 0),
    color: "sky",
  },
  {
    id: "bug-triage",
    title: "Bug Triage",
    start: buildDate(16, 11, 30),
    end: buildDate(16, 12, 30),
    color: "emerald",
  },
  {
    id: "ui-audit",
    title: "UI Audit Session",
    start: buildDate(16, 14, 0),
    end: buildDate(16, 15, 30),
    color: "violet",
  },
  {
    id: "investor-meeting",
    title: "Investor Meeting",
    start: buildDate(16, 15, 0),
    end: buildDate(16, 17, 0),
    color: "rose",
  },
  {
    id: "gym",
    title: "Gym",
    start: buildDate(17, 7, 0),
    end: buildDate(17, 8, 0),
    color: "amber",
  },
  {
    id: "design-review",
    title: "Design Review",
    start: buildDate(17, 9, 0),
    end: buildDate(17, 10, 0),
    color: "violet",
  },
  {
    id: "product-roadmap",
    title: "Product Roadmap Planning",
    start: buildDate(17, 10, 30),
    end: buildDate(17, 12, 0),
    color: "sky",
  },
  {
    id: "ui-workshop",
    title: "UI Components Workshop",
    start: buildDate(17, 13, 0),
    end: buildDate(17, 14, 30),
    color: "violet",
  },
  {
    id: "code-review",
    title: "Code Review",
    start: buildDate(17, 15, 0),
    end: buildDate(17, 16, 0),
    color: "emerald",
  },
  {
    id: "all-hands",
    title: "All Hands Meeting",
    start: buildDate(17, 16, 30),
    end: buildDate(17, 17, 30),
    color: "rose",
  },
  {
    id: "sprint-planning",
    title: "Sprint Planning",
    start: buildDate(18, 9, 0),
    end: buildDate(18, 10, 30),
    color: "emerald",
  },
  {
    id: "design-system-sync",
    title: "Design System Sync",
    start: buildDate(18, 11, 0),
    end: buildDate(18, 12, 0),
    color: "violet",
  },
  {
    id: "q1-planning",
    title: "Q1 Planning",
    start: buildDate(18, 13, 0),
    end: buildDate(18, 14, 30),
    color: "rose",
  },
  {
    id: "research-review",
    title: "User Research Review",
    start: buildDate(18, 15, 0),
    end: buildDate(18, 16, 0),
    color: "sky",
  },
  {
    id: "doctor-appointment",
    title: "Doctor Appointment",
    start: buildDate(19, 8, 30),
    end: buildDate(19, 9, 0),
    color: "amber",
  },
  {
    id: "tech-debt",
    title: "Tech Debt Discussion",
    start: buildDate(19, 11, 0),
    end: buildDate(19, 12, 0),
    color: "emerald",
  },
  {
    id: "feature-prioritization",
    title: "Feature Prioritization",
    start: buildDate(19, 14, 0),
    end: buildDate(19, 15, 30),
    color: "sky",
  },
  {
    id: "team-building",
    title: "Team Building Event",
    start: buildDate(19, 15, 0),
    end: buildDate(19, 18, 0),
    color: "rose",
  },
  {
    id: "sunday-brunch",
    title: "Sunday Brunch with Parents",
    start: buildDate(21, 11, 0),
    end: buildDate(21, 13, 0),
    color: "amber",
  },
  {
    id: "photography-hike",
    title: "Photography Hike",
    start: buildDate(21, 15, 0),
    end: buildDate(21, 17, 30),
    color: "amber",
  },
  {
    id: "launch-prep",
    title: "Product Launch Preparation",
    start: buildDate(22, 9, 0),
    end: buildDate(22, 11, 0),
    color: "rose",
  },
];

const defaultFocusDate = new Date(2024, 0, 17, 9, 0, 0, 0);

interface TimetablesCalendarClientProps {
  initialEvents?: CalendarEvent[];
  initialDate?: Date;
  initialView?: CalendarView;
}

export function TimetablesCalendarClient({
  initialEvents,
  initialDate,
  initialView = "week",
}: TimetablesCalendarClientProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(
    () => initialEvents ?? createInitialEvents(),
  );
  const [currentDate, setCurrentDate] = useState<Date>(
    () => initialDate ?? (initialEvents ? new Date() : defaultFocusDate),
  );
  const [view, setView] = useState<CalendarView>(initialView);

  return (
    <EventCalendarProvider
      events={events}
      currentDate={currentDate}
      view={view}
      weekStartsOn={1}
      onEventsChange={setEvents}
      onCurrentDateChange={setCurrentDate}
      onViewChange={setView}
    >
      <EventCalendar
        className="rounded-none border-none"
        onEventAdd={(event) => setEvents((previous) => [...previous, event])}
      />
    </EventCalendarProvider>
  );
}
