"use client";

import { useState } from "react";
import moment from "moment";

import type { RbcView } from "~/components/big-calendar";
import BigCalendar, {
  momentLocalizer,
  RbcViews,
} from "~/components/big-calendar";

//const DnDCalendar = withDragAndDrop(BigCalendar);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const CalendarWrapper = BigCalendar;
const localizer = momentLocalizer(moment);

const LandingPage = () => {
  const [view, setView] = useState<RbcView>(RbcViews.WEEK);
  const [date, setDate] = useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: RbcView) => {
    setView(newView);
  };

  return (
    <div className="m-4">
      <CalendarWrapper
        localizer={localizer}
        style={{ height: 600, width: "100%" }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        /*resizable
        draggableAccessor={() => true}
        resizableAccessor={() => true}*/
      />
    </div>
  );
};

export default LandingPage;
