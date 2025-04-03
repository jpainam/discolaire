"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { EventProps, View as RbcView } from "react-big-calendar";

import type { RouterOutputs } from "@repo/api";
import { Skeleton } from "@repo/ui/components/skeleton";
import type {
  Culture,
  DateLocalizer,
  Formats,
} from "~/components/big-calendar";
import BigCalendar, {
  dateFnsLocalizer,
  RbcViews,
} from "~/components/big-calendar";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { SkeletonLineGroup } from "~/components/skeletons/data-table";
import rangeMap from "~/lib/range-map";
import { api } from "~/trpc/react";
import { CreateEditTimetable } from "./CreateEditTimetable";

// moment.locale(i18next.language);
// const localizer = momentLocalizer(moment);
type TimetableEventType = RouterOutputs["timetable"]["classroom"][number];

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const CalendarWrapper = BigCalendar;

export function ClassroomTimeTable() {
  const params = useParams<{ id: string }>();
  const calendarEventsQuery = api.timetable.classroom.useQuery({
    classroomId: params.id,
  });
  const [view, setView] = useState<RbcView>(RbcViews.AGENDA);
  const [date, setDate] = useState(new Date());
  const { openModal } = useModal();
  const { t, i18n } = useLocale();

  const locales = {
    fr: fr,
    en: enUS,
    es: es,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

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

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      openModal({
        title: t("create_timetable"),
        view: (
          <CreateEditTimetable
            classroomId={params.id}
            start={start}
            end={end}
          />
        ),
      });
    },
    [openModal, params.id, t],
  );

  const handleSelectEvent = useCallback(
    (event: TimetableEventType) => {
      const days = getUniqueWeekdaysBetweenDates(event.start, event.end);
      openModal({
        title: t("update"),
        view: (
          <CreateEditTimetable
            days={days}
            classroomId={params.id}
            start={event.start}
            end={event.end}
            subjectId={event.subjectId}
            description={event.description}
          />
        ),
      });
    },
    [openModal, params.id, t],
  );

  const { _views, _scrollToTime, formats } = useMemo(
    () => ({
      _views: {
        month: true,
        week: true,
        day: true,
        agenda: true,
      },
      _scrollToTime: new Date(2023, 10, 27, 6),
      formats: {
        dateFormat: "d",
        weekdayFormat: (
          date: Date,
          culture?: Culture,
          localizer?: DateLocalizer,
        ) => localizer?.format(date, "EEE", culture),
        dayFormat: (date: Date, culture?: Culture, localizer?: DateLocalizer) =>
          localizer?.format(date, "EEE M/d", culture),
        timeGutterFormat: (
          date: Date,
          culture?: Culture,
          localizer?: DateLocalizer,
        ) => localizer?.format(date, "HH:mm", culture),
      } as Formats,
    }),
    [],
  );

  const handleViewChange = (view: RbcView) => {
    setView(view);
  };

  const eventPropGetter = (event: TimetableEventType) => {
    //const bgColor = calendarTypeColors[event.calendarType] || "lightgrey";
    const bgColor = event.subject.course.color;

    const newStyle = {
      backgroundColor: bgColor,
      color: "black",
      borderRadius: "5px",
    };

    return {
      style: newStyle,
    };
  };

  const CustomEvent: React.FC<EventProps<TimetableEventType>> = ({ event }) => {
    return (
      <div
        className="hidden text-sm font-bold text-white md:block"
        style={{
          backgroundColor: event.subject.course.color,
        }}
      >
        {event.subject.course.name}
      </div>
    );
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

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <div className="p-2">
      <CalendarWrapper
        localizer={localizer}
        style={{ height: 600, width: "100%" }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        events={calendarEventsQuery.data ?? []}
        //views={views}
        culture={i18n.language}
        messages={messages}
        eventPropGetter={eventPropGetter}
        //dayPropGetter={dayPropGetter}
        //defaultView="agenda"
        formats={formats}
        startAccessor="start"
        endAccessor="end"
        //dayLayoutAlgorithm="no-overlap"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        //scrollToTime={scrollToTime}
        // formats={{
        //   weekdayFormat: (date, culture, localizer) =>
        //     localizer?.format(date, "dddd", culture).substring(0, 3), // Translate the weekday names
        // }}
        components={{
          event: CustomEvent,
        }}
      />
    </div>
  );
}

const getUniqueWeekdaysBetweenDates = (
  startDate: Date,
  endDate: Date,
): { label: string; value: string }[] => {
  const dayNames = ["0", "1", "2", "3", "4", "5", "6"];
  const uniqueWeekdays = new Set<string>();

  const currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const dayIndex = currentDate.getDay(); // Get day index (0 for Sunday, 1 for Monday, etc.)
    // @ts-expect-error TODO: fix this
    uniqueWeekdays.add(dayNames[dayIndex]); // Add to Set for uniqueness

    // Increment the date by 1 day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return Array.from(uniqueWeekdays).map((v) => {
    return {
      label: v,
      value: v,
    };
  }); // Convert the Set back to an array
};
