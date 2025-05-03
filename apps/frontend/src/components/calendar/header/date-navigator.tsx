import { formatDate } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

import { useCalendar } from "~/components/calendar/calendar-context";

import { Button } from "@repo/ui/components/button";

import {
  getEventsCount,
  navigateDate,
  rangeText,
} from "~/components/calendar/helpers";

import { Badge } from "@repo/ui/components/badge";
import type { IEvent } from "~/components/calendar/interfaces";
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
        <span className="font-semibold text-sm">
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

        <p className="text-xs text-t-tertiary">
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
