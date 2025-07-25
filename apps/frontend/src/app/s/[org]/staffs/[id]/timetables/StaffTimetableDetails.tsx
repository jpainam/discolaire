"use client";

import { BookOpenText, CalendarDays, Trash2, User2Icon } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

export function StaffTimetableDetails({
  event,
}: {
  event: RouterOutputs["subjectTimetable"]["byClassroom"][number];
}) {
  const { t, i18n } = useLocale();

  const { closeModal } = useModal();

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="text-muted-foreground flex flex-row items-center gap-2">
        <User2Icon className="h-4 w-4" />
        {t("teacher")}
      </div>
      <div className="font-bold">
        {event.subject.teacher?.prefix} {event.subject.teacher?.lastName}
      </div>
      <div className="text-muted-foreground flex flex-row items-center gap-2">
        <BookOpenText className="h-4 w-4" />
        {t("subject")}
      </div>
      <div className="font-bold">{event.subject.course.name}</div>
      <div className="text-muted-foreground flex flex-row items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        {t("start_time")}
      </div>
      <div>
        {event.start.toLocaleDateString(i18n.language, {
          timeZone: "UTC",
        })}{" "}
        - {event.start.toLocaleTimeString(i18n.language)}
      </div>
      <div className="text-muted-foreground flex flex-row items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        {t("end_time")}
      </div>
      <div>
        {event.end.toLocaleDateString(i18n.language, {
          timeZone: "UTC",
        })}{" "}
        - {event.end.toLocaleTimeString(i18n.language)}
      </div>

      <Button
        size={"sm"}
        variant={"outline"}
        onClick={() => {
          closeModal();
        }}
      >
        <Trash2 />
        {t("close")}
      </Button>
    </div>
  );
}
