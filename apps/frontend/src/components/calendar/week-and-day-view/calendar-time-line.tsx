import { useEffect, useState } from "react";
import { format } from "date-fns";

export function CalendarTimeline() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return (minutes / 1440) * 100;
  };

  const formatCurrentTime = () => {
    return format(currentTime, "hh:mm a");
  };

  return (
    <div
      className="border-primary-600 dark:border-primary-700 pointer-events-none absolute inset-x-0 z-50 border-t"
      style={{ top: `${getCurrentTimePosition()}%` }}
    >
      <div className="bg-primary-600 dark:bg-primary-700 absolute -top-1.5 -left-1.5 size-3 rounded-full"></div>

      <div className="bg-muted text-muted-foreground dark:text-primary-700 absolute -left-18 flex w-16 -translate-y-1/2 justify-end pr-1 text-xs font-medium">
        {formatCurrentTime()}
      </div>
    </div>
  );
}
