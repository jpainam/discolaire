"use client";

import type { View } from "react-big-calendar";
import { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { calendarEvents } from "~/data/calendar-events";

import "./big-calendar.css";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 17, 0, 0)}
    />
  );
};

export default BigCalendar;
