"use client";

import type React from "react";
import { useMemo } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { toast } from "sonner";

import type { CalendarEvent, CalendarView } from "~/components/event-calendar";
import {
  addHoursToDate,
  AgendaDaysToShow,
  AgendaView,
  DayView,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
} from "~/components/event-calendar";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModal } from "~/hooks/use-modal";
import { cn } from "~/lib/utils";
import { useCalendar } from "./calendar-context";

export interface EventCalendarProps {
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
  getEventModalOptions?: (
    event: CalendarEvent,
    actions: { deleteEvent: () => void },
  ) => {
    title?: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
    view: React.ReactNode;
  } | null;
  className?: string;
}

export function EventCalendar({
  onEventAdd,
  onEventUpdate: _onEventUpdate,
  onEventDelete,
  getEventModalOptions,
  className,
}: EventCalendarProps) {
  const {
    currentDate,
    setCurrentDate,
    events,
    setEvents,
    view,
    setView,
    weekStartsOn,
  } = useCalendar();

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else {
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const { openModal } = useModal();

  const handleEventCreate = (startTime: Date) => {
    if (!onEventAdd) {
      return;
    }

    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;

    const snappedStartTime = new Date(startTime);

    if (remainder !== 0) {
      if (remainder < 7.5) {
        snappedStartTime.setMinutes(minutes - remainder);
      } else {
        snappedStartTime.setMinutes(minutes + (15 - remainder));
      }
      snappedStartTime.setSeconds(0);
      snappedStartTime.setMilliseconds(0);
    }

    onEventAdd({
      id: `${Date.now()}`,
      title: "New event",
      start: snappedStartTime,
      end: addHoursToDate(snappedStartTime, 1),
      allDay: false,
      color: "sky",
    });
  };

  const handleEventDelete = (eventToDelete: CalendarEvent) => {
    setEvents((previousEvents) =>
      previousEvents.filter((event) => event.id !== eventToDelete.id),
    );
    onEventDelete?.(eventToDelete);

    toast(`Event "${eventToDelete.title}" deleted`, {
      description: format(new Date(eventToDelete.start), "MMM d, yyyy"),
      position: "bottom-left",
    });
  };

  const handleEventSelect = (event: CalendarEvent) => {
    const customModal = getEventModalOptions?.(event, {
      deleteEvent: () => handleEventDelete(event),
    });

    if (customModal) {
      openModal(customModal);
      return;
    }

    if (customModal === null) {
      return;
    }

    openModal({
      title: event.title,
      view: (
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            {format(new Date(event.start), "PPP HH:mm")} -{" "}
            {format(new Date(event.end), "HH:mm")}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleEventDelete(event)}
          >
            Delete event
          </Button>
        </div>
      ),
    });
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    }

    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn });
      const end = endOfWeek(currentDate, { weekStartsOn });

      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy");
      }

      return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`;
    }

    if (view === "day") {
      return format(currentDate, "EEEE");
    }

    const start = currentDate;
    const end = addDays(currentDate, AgendaDaysToShow - 1);

    if (isSameMonth(start, end)) {
      return format(start, "MMMM yyyy");
    }

    return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`;
  }, [currentDate, view, weekStartsOn]);

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border has-data-[slot=month-view]:flex-1",
        className,
      )}
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2 sm:px-4">
        <h2 className="sm:text-md text-lg font-semibold">{viewTitle}</h2>

        <div className="flex items-center gap-2">
          <Select
            value={view}
            onValueChange={(nextView) => setView(nextView as CalendarView)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>

          <ButtonGroup>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              aria-label="Previous"
            >
              <ChevronLeftIcon />
            </Button>
            <Button variant="outline" onClick={handleToday}>
              Today
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              aria-label="Next"
            >
              <ChevronRightIcon size={16} aria-hidden="true" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            weekStartsOn={weekStartsOn}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            weekStartsOn={weekStartsOn}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "agenda" && (
          <AgendaView
            currentDate={currentDate}
            events={events}
            onEventSelect={handleEventSelect}
          />
        )}
      </div>
    </div>
  );
}
