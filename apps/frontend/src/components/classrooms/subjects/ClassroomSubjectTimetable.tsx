"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useCheckPermission } from "~/hooks/use-permission";
import { getWeekdayName } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function ClassroomSubjectTimetable({
  subjectId,
}: {
  subjectId: number;
}) {
  const trpc = useTRPC();
  const subjectQuery = useQuery(trpc.subject.get.queryOptions(subjectId));
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [weekdays, setWeekdays] = useState<number[]>([1]);
  const t = useTranslations();
  //const { closeSheet } = useSheet();

  const confirm = useConfirm();
  const locale = useLocale();

  const canCreateTimetable = useCheckPermission("timetable.create");

  const canDeleteTimetable = useCheckPermission("timetable.delete");

  const queryClient = useQueryClient();
  const deleteTimetableSlot = useMutation(
    trpc.subjectTimetable.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectTimetable.pathFilter());
        await queryClient.invalidateQueries(trpc.subject.pathFilter());
        await queryClient.invalidateQueries(
          trpc.classroom.subjects.pathFilter(),
        );
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
        await queryClient.invalidateQueries(trpc.subject.pathFilter());
        await queryClient.invalidateQueries(
          trpc.classroom.subjects.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
      },
    }),
  );
  const handleAddTimeSlot = () => {
    if (slotStart && slotEnd) {
      createTimetableSlot.mutate({
        subjectId: subjectId,
        start: slotStart,
        end: slotEnd,
        weekdays: weekdays,
      });
      setSlotStart("");
      setSlotEnd("");
    }
  };

  if (subjectQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  const timetables = subjectQuery.data?.timetables;
  // if (!timetables || timetables.length == 0) {
  //   return (

  //   );
  // }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="start-time">{t("start_time")}</Label>
          <Input
            id="start-time"
            type="time"
            value={slotStart}
            onChange={(e) => setSlotStart(e.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="end-time">{t("end_time")}</Label>
          <Input
            id="end-time"
            type="time"
            value={slotEnd}
            onChange={(e) => setSlotEnd(e.target.value)}
          />
        </div>
        {canCreateTimetable && (
          <div className="flex items-end">
            <Button onClick={handleAddTimeSlot}>
              {/* <Plus className="h-4 w-4" /> */}
              {t("add")}
            </Button>
          </div>
        )}
      </div>
      <FieldGroup>
        <FieldGroup className="flex flex-row flex-wrap gap-1 [--radius:9999rem]">
          {[0, 1, 2, 3, 4, 5, 6].map((option) => (
            <FieldLabel
              htmlFor={option.toString()}
              key={option}
              className="!w-fit"
            >
              <Field
                orientation="horizontal"
                className="gap-1.5 overflow-hidden !px-3 !py-1.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-2"
              >
                <Checkbox
                  value={option.toString()}
                  id={option.toString()}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      setWeekdays((w) => w.filter((day) => day !== option));
                    } else {
                      setWeekdays((w) => [...w, option]);
                    }
                  }}
                  defaultChecked={weekdays.includes(option)}
                  className="-ml-6 -translate-x-1 rounded-full transition-all duration-100 ease-linear data-[state=checked]:ml-0 data-[state=checked]:translate-x-0"
                />
                <FieldTitle>{getWeekdayName(option, locale)}</FieldTitle>
              </Field>
            </FieldLabel>
          ))}
        </FieldGroup>
      </FieldGroup>
      <Separator />
      <div className="grid flex-1 auto-rows-min gap-2 overflow-y-auto">
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
          {timetables?.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-lg border p-2 text-sm"
            >
              <span className="font-bold capitalize">
                {getWeekdayName(slot.weekday, locale)}
              </span>
              <span className="font-medium">
                {slot.start} - {slot.end}
              </span>
              {canDeleteTimetable && (
                <Button
                  variant="ghost"
                  className="hover:text-destructive"
                  size="icon-sm"
                  onClick={async () => {
                    const isconfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                    });
                    if (isconfirmed) {
                      toast.loading(t("Processing"), { id: 0 });
                      deleteTimetableSlot.mutate(slot.id);
                    }
                  }}
                >
                  <Trash />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* <div className={"mt-auto flex flex-col gap-2"}>
        <Button
          onClick={() => {
            closeSheet();
          }}
          variant={"outline"}
          //size={"sm"}
        >
          {t("close")}
        </Button>
      </div> */}
    </div>
  );
}
