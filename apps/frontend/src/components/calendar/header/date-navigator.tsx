import { useMemo } from "react";
import { formatDate } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";

import type { IEvent } from "~/components/calendar/interfaces";
import { useCalendar } from "~/components/calendar/calendar-context";
import {
  getEventsCount,
  navigateDate,
  rangeText,
} from "~/components/calendar/helpers";
import { useLocale } from "~/i18n";

interface IProps {
  events: IEvent[];
}

export function DateNavigator({ events }: IProps) {
  const { selectedDate, setSelectedDate, view } = useCalendar();

  const month = formatDate(selectedDate, "MMMM");
  const year = selectedDate.getFullYear();

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view],
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));
  const { t } = useLocale();
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">
          {month} {year}
        </span>
        <Badge className="text-xs">
          {eventCount} {t("lessons")}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handlePrevious}
        >
          <ChevronLeft />
        </Button>

        <p className="text-t-tertiary text-xs">
          {rangeText(view, selectedDate)}
        </p>

        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
