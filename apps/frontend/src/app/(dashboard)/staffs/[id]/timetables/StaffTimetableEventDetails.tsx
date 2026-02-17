"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import type { CalendarEvent } from "~/components/event-calendar";
import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";

interface StaffTimetableEventMetadata {
  subjectName?: string;
  classroomName?: string;
  studentCount?: number;
}

function getMetadata(event: CalendarEvent): StaffTimetableEventMetadata {
  const raw = event.metadata;
  if (!raw || typeof raw !== "object") return {};
  return {
    subjectName:
      typeof raw.subjectName === "string" ? raw.subjectName : undefined,
    classroomName:
      typeof raw.classroomName === "string" ? raw.classroomName : undefined,
    studentCount:
      typeof raw.studentCount === "number" ? raw.studentCount : undefined,
  };
}

export function StaffTimetableEventDetails({
  event,
}: {
  event: CalendarEvent;
}) {
  const t = useTranslations();
  const { closeModal } = useModal();
  const meta = useMemo(() => getMetadata(event), [event]);

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground">
          {format(new Date(event.start), "PPP HH:mm")} -{" "}
          {format(new Date(event.end), "HH:mm")}
        </div>
        <div>
          <span className="text-muted-foreground">{t("subject")}: </span>
          <span className="font-medium">
            {meta.subjectName ?? event.description ?? event.title}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">{t("classroom")}: </span>
          <span className="font-medium">
            {meta.classroomName ?? event.location ?? "—"}
          </span>
        </div>
        {meta.studentCount != null && (
          <div>
            <span className="text-muted-foreground">{t("students")}: </span>
            <span className="font-medium">{meta.studentCount}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={closeModal}>
          {t("close")}
        </Button>
      </div>
    </div>
  );
}
