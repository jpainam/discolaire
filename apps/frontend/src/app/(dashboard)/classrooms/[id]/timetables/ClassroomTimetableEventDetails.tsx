"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { CalendarEvent } from "~/components/event-calendar";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

type DeleteScope = "today" | "past" | "future";

interface ClassroomTimetableEventMetadata {
  timetableId: number;
  subjectId: number;
  subjectName?: string;
  teacherName?: string | null;
}

function getClassroomTimetableMetadata(
  event: CalendarEvent,
): ClassroomTimetableEventMetadata | null {
  const metadata = event.metadata;
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const raw = metadata;
  if (
    typeof raw.timetableId !== "number" ||
    typeof raw.subjectId !== "number"
  ) {
    return null;
  }

  return {
    timetableId: raw.timetableId,
    subjectId: raw.subjectId,
    subjectName:
      typeof raw.subjectName === "string" ? raw.subjectName : undefined,
    teacherName:
      typeof raw.teacherName === "string" || raw.teacherName === null
        ? raw.teacherName
        : undefined,
  };
}

export function ClassroomTimetableEventDetails({
  event,
}: {
  event: CalendarEvent;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();
  const [scope, setScope] = useState<DeleteScope>("future");

  const metadata = useMemo(() => getClassroomTimetableMetadata(event), [event]);
  const fallbackTimetableId = Number.parseInt(event.id.split("-")[0] ?? "", 10);
  const timetableId = metadata?.timetableId ?? fallbackTimetableId;

  const deleteEventMutation = useMutation(
    trpc.subjectTimetable.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.classroom.timetables.pathFilter()),
          queryClient.invalidateQueries(trpc.subjectTimetable.pathFilter()),
        ]);
        toast.success(t("deleted_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );

  const isInvalidTimetableId =
    !Number.isFinite(timetableId) || timetableId <= 0;

  const subjectName = metadata?.subjectName ?? event.description ?? event.title;
  const teacherName = metadata?.teacherName ?? "N/A";

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground">
          {format(new Date(event.start), "PPP HH:mm")} -{" "}
          {format(new Date(event.end), "HH:mm")}
        </div>
        <div>
          <span className="text-muted-foreground">{t("subject")}: </span>
          <span className="font-medium">{subjectName}</span>
        </div>
        <div>
          <span className="text-muted-foreground">{t("teacher")}: </span>
          <span className="font-medium">{teacherName}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Delete scope</Label>
        <Select
          value={scope}
          onValueChange={(value) => setScope(value as DeleteScope)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today event</SelectItem>
            <SelectItem value="past">Passed events</SelectItem>
            <SelectItem value="future">All future events</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={closeModal}
          disabled={deleteEventMutation.isPending}
        >
          {t("close")}
        </Button>
        <Button
          variant="destructive"
          disabled={deleteEventMutation.isPending || isInvalidTimetableId}
          onClick={async () => {
            if (isInvalidTimetableId) {
              toast.error("Missing timetable id", { id: 0 });
              return;
            }

            await deleteEventMutation.mutateAsync({
              id: timetableId,
              scope,
              occurrenceDate: event.start,
            });
          }}
        >
          {t("delete")}
        </Button>
      </div>
    </div>
  );
}
