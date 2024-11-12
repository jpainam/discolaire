"use client";

import { BookOpenText, CalendarDays, Trash2, User2Icon } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

export function StaffTimetableDetails({
  event,
}: {
  event: RouterOutputs["lesson"]["byClassroom"][number];
}) {
  const { t, i18n } = useLocale();

  const { closeModal } = useModal();

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex flex-row items-center text-muted-foreground">
        <User2Icon className="mr-2 h-4 w-4" />
        {t("teacher")}
      </div>
      <div className="font-bold">
        {event.subject.teacher?.prefix} {event.subject.teacher?.lastName}
      </div>
      <div className="flex flex-row items-center text-muted-foreground">
        <BookOpenText className="mr-2 h-4 w-4" />
        {t("subject")}
      </div>
      <div className="font-bold">{event.subject.course.name}</div>
      <div className="flex flex-row items-center text-muted-foreground">
        <CalendarDays className="mr-2 h-4 w-4" />
        {t("start_time")}
      </div>
      <div>
        {event.start.toLocaleDateString(i18n.language, {
          timeZone: "UTC",
        })}{" "}
        - {event.startTime.toLocaleTimeString(i18n.language)}
      </div>
      <div className="flex flex-row items-center text-muted-foreground">
        <CalendarDays className="mr-2 h-4 w-4" />
        {t("end_time")}
      </div>
      <div>
        {event.end.toLocaleDateString(i18n.language, {
          timeZone: "UTC",
        })}{" "}
        - {event.endTime.toLocaleTimeString(i18n.language)}
      </div>

      <Button
        size={"sm"}
        variant={"outline"}
        onClick={() => {
          closeModal();
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {t("close")}
      </Button>
    </div>
  );
}
