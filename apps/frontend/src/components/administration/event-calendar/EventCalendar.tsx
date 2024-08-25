"use client";

import { useCallback, useMemo, useState } from "react";
import {
  addMonths,
  format,
  getDay,
  getMonth,
  getYear,
  isToday,
  parse,
  startOfWeek,
} from "date-fns";
//import { enUS, fr } from "date-fns/locale";

import { enUS, es, fr } from "date-fns/locale";
import {
  Calendar,
  dateFnsLocalizer,
  EventProps,
  View as RbcView,
} from "react-big-calendar";

import { useLocale } from "@repo/i18n";

import { useModal } from "~/hooks/use-modal";
import { useResolvedTheme } from "~/hooks/use-resolved-theme";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { useSearchParams } from "next/navigation";
import { inferProcedureOutput } from "@trpc/server";

import { Skeleton } from "@repo/ui/skeleton";

import { SkeletonLineGroup } from "~/components/skeletons/data-table";
import rangeMap from "~/lib/range-map";
import { cn } from "~/lib/utils";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import EventForm from "./EventForm";

const calendarTypeColors = {
  "School Year": "#4fc793",
  Teaching: "#F1595C",
  Holidays: "#4669FA",
};

// export interface CalendarEvent {
//   id: string;
//   calendarType: "School Year" | "Teaching" | "Holidays";
//   title?: string;
//   description?: string;
//   classroom?: string;
//   subject?: string;
//   repeat?: "None" | "Daily" | "Weekly" | "Monthly" | "Yearly";
//   alert?: "None" | "15min" | "30min" | "1hour";
//   start: Date;
//   end: Date;
// }

type CalendarEventProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["calendarEvent"]["all"]>
>[number];

export function EventCalendar() {
  const searchParams = useSearchParams();
  const calendarEventsQuery = api.calendarEvent.all.useQuery({
    start: searchParams.get("start")
      ? new Date(searchParams.get("start") || "")
      : undefined,
    end: searchParams.get("end")
      ? new Date(searchParams.get("end") || "")
      : undefined,
  });

  const theme = useResolvedTheme();
  const [view, setView] = useState<RbcView>("month");
  const { openModal } = useModal();
  const { t, i18n } = useLocale();
  const locales = {
    fr: fr,
    en: enUS,
    es: es,
  };

  const messages = {
    agenda: t("agenda"),
    allDay: t("all_day"),
    month: t("month"),
    day: t("day"),
    today: t("today"),
    previous: t("previous"),
    next: t("next"),
    date: t("date"),
    noEventsInRange: t("no_events_in_range"),
    time: t("time"),
    tomorrow: t("tomorrow"),
    week: t("week"),
    work_week: t("work_week"),
    yesterday: t("yesterday"),
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const calendarToolbarClassName = cn(
    "[&_.rbc-btn-group_button]:duration-200 [&_.rbc-toolbar_.rbc-toolbar-label]:my-1 [&_.rbc-toolbar_.rbc-toolbar-label]:whitespace-nowrap",
    "[&_.rbc-btn-group_button.rbc-active]:bg-primary [&_.rbc-btn-group_button]:text-sm [&_.rbc-time-gutter]:text-sm [&_.rbc-toolbar_.rbc-toolbar-label]:text-sm",
    theme === "dark"
      ? "[&_.rbc-toolbar_>_*:last-child_>_button:focus]:!text-gray-0 [&_.rbc-toolbar_>_*:last-child_>_button.rbc-active:hover]:!bg-primary-dark [&_.rbc-btn-group_button.rbc-active:hover]:bg-white [&_.rbc-btn-group_button.rbc-active:hover]:text-black [&_.rbc-btn-group_button.rbc-active]:text-black [&_.rbc-btn-group_button:hover]:bg-gray-600 [&_.rbc-btn-group_button]:text-gray-50 [&_.rbc-toolbar_>_*:last-child_>_button.rbc-active:hover]:!text-gray-50 [&_.rbc-toolbar_>_*:last-child_>_button:focus]:!bg-primary [&_.rbc-toolbar_>_*:last-child_>_button:hover]:!bg-gray-600 [&_.rbc-toolbar_>_*:last-child_>_button:hover]:!text-gray-50"
      : "[&_.rbc-toolbar_>_*:last-child_>_button:focus]:!text-gray-0 [&_.rbc-toolbar_>_*:last-child_>_button.rbc-active:hover]:!bg-primary-dark [&_.rbc-toolbar_>_*:last-child_>_button.rbc-active:hover]:!text-gray-0 [&_.rbc-btn-group_button.rbc-active:hover]:bg-black [&_.rbc-btn-group_button.rbc-active:hover]:text-white [&_.rbc-btn-group_button.rbc-active]:text-white [&_.rbc-btn-group_button:hover]:bg-gray-300 [&_.rbc-btn-group_button]:text-gray-900 [&_.rbc-toolbar_>_*:last-child_>_button.rbc-active]:!text-white [&_.rbc-toolbar_>_*:last-child_>_button:focus]:!bg-primary [&_.rbc-toolbar_>_*:last-child_>_button:hover]:!bg-gray-300 [&_.rbc-toolbar_>_*:last-child_>_button:hover]:!text-gray-900",
  );

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      openModal({
        title: t("Create a new event"),
        className: "w-full sm:w-[650px] sm:px-8 p-4",
        view: <EventForm startDate={start} endDate={end} />,
      });
    },

    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEventProcedureOutput) => {
      openModal({
        title: t("Update event"),
        className: "w-full sm:w-[650px] sm:px-8 p-4  ",
        view: <EventForm event={event} />,
      });
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { views, scrollToTime, formats } = useMemo(
    () => ({
      views: {
        month: true,
        week: true,
        day: true,
        agenda: true,
      },
      scrollToTime: new Date(2023, 10, 27, 6),
      formats: {
        dateFormat: "d",
        weekdayFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, "EEE", culture),
        dayFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, "EEE M/d", culture),
        timeGutterFormat: (date: Date, culture: any, localizer: any) =>
          localizer.format(date, "HH:mm", culture),
      },
    }),
    [],
  );

  const handleViewChange = (view: RbcView) => {
    setView(view);
  };

  const eventPropGetter = (event: CalendarEventProcedureOutput) => {
    //const bgColor = calendarTypeColors[event.calendarType] || "lightgrey";
    const bgColor = event.calendarType?.backgroundColor || "lightgrey";

    let newStyle = {
      backgroundColor: bgColor,
      color: "black",
      borderRadius: "5px",
    };

    return {
      style: newStyle,
    };
  };

  const CustomEvent: React.FC<EventProps<CalendarEventProcedureOutput>> = ({
    event,
  }) => {
    return (
      <div className="hidden text-sm text-white md:block">{event.title}</div>
    );
  };

  const dayPropGetter = (date: Date) => {
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
    const today = new Date();
    const nextMonth = addMonths(today, 1);
    const isNextMonth =
      getMonth(date) === getMonth(nextMonth) &&
      getYear(date) === getYear(nextMonth);

    let style = {};
    let className = "";

    if (isWeekend) {
      className = "text-secondary-foreground bg-secondary";
    } else if (isNextMonth) {
      className = "text-muted-foreground/40 bg-muted/40";
    } else if (isToday(date)) {
      className = "text-accent-foreground bg-accent";
    } else {
      className = "";
    }

    return { style, className };
  };

  if (calendarEventsQuery.isPending) {
    return (
      <div className="flex w-full flex-col gap-2 px-2">
        <div className="flex flex-row items-center justify-between">
          <Skeleton className="h-8 md:w-1/4" />
          <Skeleton className="h-8 md:w-32" />
          <Skeleton className="h-8 md:w-1/4" />
        </div>
        {rangeMap(5, (index) => (
          <SkeletonLineGroup
            className="grid-cols-7 gap-2"
            columns={7}
            key={index}
            skeletonClassName="h-[150px] w-full"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-15rem)] px-2">
      <Calendar
        localizer={localizer}
        events={calendarEventsQuery.data || []}
        views={views}
        view={view}
        messages={messages}
        onView={handleViewChange}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        defaultView="month"
        formats={formats}
        startAccessor="start"
        culture={i18n.language}
        endAccessor="end"
        dayLayoutAlgorithm="no-overlap"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        scrollToTime={scrollToTime}
        className={calendarToolbarClassName}
        components={{
          event: CustomEvent,
        }}
      />
    </div>
  );
}
