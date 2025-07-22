"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Pencil, Text, Trash, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";

import type { IEvent } from "./interfaces";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

interface IProps {
  event: IEvent;
}

export function EventDetails({ event }: IProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { closeModal } = useModal();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { t } = useLocale();
  const trpc = useTRPC();
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
    <div>
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <User className="text-t-secondary mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Responsible</p>
            <p className="text-t-secondary text-sm">{event.user.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="text-t-secondary mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Start Date</p>
            <p className="text-t-secondary text-sm">
              {format(startDate, "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="text-t-secondary mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">End Date</p>
            <p className="text-t-secondary text-sm">
              {format(endDate, "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Text className="text-t-secondary mt-1 size-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-t-secondary text-sm">{event.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="icon">
            <Pencil />
          </Button>
          <Button
            size="icon"
            variant={"ghost"}
            onClick={async () => {
              closeModal();
              const isConfirm = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
              });
              if (isConfirm) {
                toast.loading(t("deleting"), { id: 0 });
                deleteLessonMutation.mutate({ id: event.id, type: "after" });
              }
            }}
          >
            <Trash className="text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
