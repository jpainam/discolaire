"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

export function ClassroomSubjectTimetable({
  subjectId,
}: {
  subjectId: number;
}) {
  const trpc = useTRPC();
  const timetableQuery = useQuery(
    trpc.subject.timetables.queryOptions(subjectId),
  );
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const t = useTranslations();
  const { closeSheet } = useSheet();
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const deleteTimetableSlot = useMutation(
    trpc.subjectTimetable.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectTimetable.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const createTimetableSlot = useMutation(
    trpc.subjectTimetable.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectTimetable.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
      },
    }),
  );
  const handleAddTimeSlot = () => {
    if (slotStart && slotEnd) {
      createTimetableSlot.mutate({
        subjectId: subjectId,
      })
      setSlotStart("");
      setSlotEnd("");
    }
  };

  if (timetableQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  const timetables = timetableQuery.data;
  // if (!timetables || timetables.length == 0) {
  //   return (

  //   );
  // }
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex gap-2 px-4">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="time"
            value={slotStart}
            onChange={(e) => setSlotStart(e.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input
            id="end-time"
            type="time"
            value={slotEnd}
            onChange={(e) => setSlotEnd(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAddTimeSlot}>
            <Plus className="h-4 w-4" />
            {t("add")}
          </Button>
        </div>
      </div>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto p-4">
        {!timetables ||
          (timetables.length == 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CalendarDays />
                </EmptyMedia>
                <EmptyTitle>Aucun emplois de temps</EmptyTitle>
                <EmptyDescription>
                  Vous n'avez pas encore créer un emplois de temps.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent></EmptyContent>
            </Empty>
          ))}
        <div className="space-y-2">
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="font-medium">
                {slot.startTime} - {slot.endTime}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTimeSlot(slot.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {timeSlots.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No time slots added yet
            </p>
          )}
        </div>
      </div>
      <div className={"mt-auto flex flex-col gap-2 p-4"}>
        <Button
          onClick={() => {
            closeSheet();
          }}
          variant={"outline"}
          size={"sm"}
        >
          {t("close")}
        </Button>
      </div>
    </div>
  );
}
