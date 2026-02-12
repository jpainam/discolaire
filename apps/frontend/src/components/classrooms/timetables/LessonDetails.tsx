"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpenText,
  CalendarDays,
  Pencil,
  Trash2,
  User2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function LessonDetails({
  event,
}: {
  event: RouterOutputs["subjectTimetable"]["byClassroom"][number];
}) {
  const t = useTranslations();
  const confirm = useConfirm();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { openModal, closeModal } = useModal();
  const deleteLessonMutation = useMutation(
    trpc.subjectTimetable.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.subjectTimetable.byClassroom.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
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
        {/* {event.start.toLocaleDateString(locale, {
          timeZone: "UTC",
        })}{" "}
        - {event.start.toLocaleTimeString(locale)} */}
      </div>
      <div className="text-muted-foreground flex flex-row items-center">
        <CalendarDays className="mr-2 h-4 w-4" />
        {t("end_time")}
      </div>
      <div>
        {/* {event.end.toLocaleDateString(locale, {
          timeZone: "UTC",
        })}{" "}
        - {event.end.toLocaleTimeString(locale)} */}
      </div>

      <Button
        size={"sm"}
        variant={"destructive"}
        onClick={async () => {
          closeModal();
          await confirm({
            title: t("delete"),
            description: t("delete_confirmation"),
            alertDialogTitle: {
              className: "flex items-center gap-2",
            },
            icon: <Trash2 className="text-destructive h-5 w-5" />,

            onConfirm: async () => {
              await deleteLessonMutation.mutateAsync({
                id: event.id,
                type: "after",
              });
            },
          });
        }}
      >
        <Trash2 />
        {t("delete")}
      </Button>
      <Button
        size={"sm"}
        variant={"default"}
        onClick={() => {
          openModal({
            title: t("update"),
            view: <></>,
          });
        }}
      >
        <Pencil />
        {t("edit")}
      </Button>
    </div>
  );
}
