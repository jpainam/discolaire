"use client";

import {
  BookOpenText,
  CalendarDays,
  Pencil,
  Trash2,
  User2Icon,
} from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { api } from "~/trpc/react";
import { CreateEditLesson } from "./CreateEditLesson";

export function LessonDetails({
  event,
}: {
  event: RouterOutputs["lesson"]["byClassroom"][number];
}) {
  const { t, i18n } = useLocale();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const { openModal, closeModal } = useModal();
  const deleteLessonMutation = api.lesson.delete.useMutation({
    onSettled: () => {
      void utils.lesson.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      closeModal();
    },
  });
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex flex-row gap-2 items-center text-muted-foreground">
        <User2Icon className="h-4 w-4" />
        {t("teacher")}
      </div>
      <div className="font-bold">
        {event.subject.teacher?.prefix} {event.subject.teacher?.lastName}
      </div>
      <div className="flex flex-row gap-2 items-center text-muted-foreground">
        <BookOpenText className="h-4 w-4" />
        {t("subject")}
      </div>
      <div className="font-bold">{event.subject.course.name}</div>
      <div className="flex flex-row gap-2 items-center text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
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
        variant={"destructive"}
        onClick={async () => {
          closeModal();
          const isConfirm = await confirm({
            title: t("delete"),
            description: t("delete_confirmation"),
            alertDialogTitle: {
              className: "flex items-center gap-2",
            },
            icon: <Trash2 className="h-5 w-5 text-destructive" />,
          });
          if (isConfirm) {
            toast.loading(t("deleting"), { id: 0 });
            deleteLessonMutation.mutate(event.id);
          }
        }}
      >
        <Trash2 />
        {t("delete")}
      </Button>
      <Button
        size={"sm"}
        variant={"default"}
        onClick={() => {
          const startHours = String(event.startTime.getHours()).padStart(
            2,
            "0",
          );
          const startMinutes = String(event.startTime.getMinutes()).padStart(
            2,
            "0",
          );
          const endHours = String(event.endTime.getHours()).padStart(2, "0");
          const endMinutes = String(event.endTime.getMinutes()).padStart(
            2,
            "0",
          );

          closeModal();

          openModal({
            title: t("update"),
            view: (
              <CreateEditLesson
                daysOfWeek={[event.startTime.getDay()]}
                startTime={`${startHours}:${startMinutes}`}
                endTime={`${endHours}:${endMinutes}`}
                subjectId={event.subjectId}
              />
            ),
          });
        }}
      >
        <Pencil />
        {t("edit")}
      </Button>
    </div>
  );
}
