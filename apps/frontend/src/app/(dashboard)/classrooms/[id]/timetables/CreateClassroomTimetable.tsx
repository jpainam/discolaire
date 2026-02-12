"use client";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useModal } from "~/hooks/use-modal";
import { cn, getWeekdayName } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface CreatePayload {
  subjectId: number;
  start: string;
  end: string;
  weekdays: number[];
}

interface QueuedSlot extends CreatePayload {
  id: string;
}

function toTimeString(date: Date) {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}

function normalizeWeekdays(weekdays: number[]) {
  return Array.from(new Set(weekdays))
    .filter((weekday) => weekday >= 0 && weekday <= 6)
    .sort((a, b) => a - b);
}

function timeToMinutes(value: string) {
  const [hours = 0, minutes = 0] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function CreateClassroomTimetable({
  classroomId,
  initialStart,
  initialEnd,
  initialSubjectId,
}: {
  classroomId: string;
  initialStart?: Date;
  initialEnd?: Date;
  initialSubjectId?: number;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const subjectsQuery = useQuery(trpc.classroom.subjects.queryOptions(classroomId));
  const createTimetableSlot = useMutation(trpc.subjectTimetable.create.mutationOptions());

  const [subjectId, setSubjectId] = useState<string | null>(
    initialSubjectId ? `${initialSubjectId}` : null,
  );
  const [slotStart, setSlotStart] = useState(() =>
    initialStart ? toTimeString(initialStart) : "08:00",
  );
  const [slotEnd, setSlotEnd] = useState(() =>
    initialEnd ? toTimeString(initialEnd) : "09:00",
  );
  const [weekdays, setWeekdays] = useState<number[]>(() =>
    initialStart ? [initialStart.getDay()] : [1],
  );
  const [queuedSlots, setQueuedSlots] = useState<QueuedSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectById = useMemo(
    () =>
      new Map(
        (subjectsQuery.data ?? []).map((subject) => [
          subject.id,
          subject.course.shortName || subject.course.name,
        ]),
      ),
    [subjectsQuery.data],
  );

  const isBusy = createTimetableSlot.isPending || isSubmitting;

  const buildPayload = (): CreatePayload | null => {
    if (!subjectId) {
      toast.error("Subject is required", { id: 0 });
      return null;
    }

    const normalizedWeekdays = normalizeWeekdays(weekdays);
    if (normalizedWeekdays.length === 0) {
      toast.error("Select at least one day", { id: 0 });
      return null;
    }

    if (!slotStart || !slotEnd) {
      toast.error("Start and end time are required", { id: 0 });
      return null;
    }

    if (timeToMinutes(slotEnd) <= timeToMinutes(slotStart)) {
      toast.error("End time must be after start time", { id: 0 });
      return null;
    }

    return {
      subjectId: Number(subjectId),
      start: slotStart,
      end: slotEnd,
      weekdays: normalizedWeekdays,
    };
  };

  const queueCurrentSlot = () => {
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    const duplicate = queuedSlots.some((slot) => {
      const sameWeekdays =
        slot.weekdays.length === payload.weekdays.length &&
        slot.weekdays.every((weekday, index) => weekday === payload.weekdays[index]);

      return (
        slot.subjectId === payload.subjectId &&
        slot.start === payload.start &&
        slot.end === payload.end &&
        sameWeekdays
      );
    });

    if (duplicate) {
      toast.message("Slot already queued", { id: 0 });
      return;
    }

    setQueuedSlots((slots) => [
      ...slots,
      {
        id: `${Date.now()}-${Math.random()}`,
        ...payload,
      },
    ]);
  };

  const createSlots = async (slots: CreatePayload[]) => {
    if (slots.length === 0) {
      return false;
    }

    setIsSubmitting(true);
    toast.loading(t("creating"), { id: 0 });

    try {
      await Promise.all(
        slots.map((slot) => {
          return createTimetableSlot.mutateAsync(slot);
        }),
      );

      await Promise.all([
        queryClient.invalidateQueries(trpc.classroom.timetables.pathFilter()),
        queryClient.invalidateQueries(trpc.subjectTimetable.pathFilter()),
      ]);

      toast.success(t("created_successfully"), { id: 0 });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message, { id: 0 });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const createCurrentSlot = async () => {
    const payload = buildPayload();
    if (!payload) {
      return;
    }
    await createSlots([payload]);
  };

  const createQueuedSlots = async () => {
    if (queuedSlots.length === 0) {
      return;
    }
    const success = await createSlots(queuedSlots);
    if (success) {
      setQueuedSlots([]);
    }
  };

  return (
    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>{t("subject")}</Label>
          <SubjectSelector
            classroomId={classroomId}
            defaultValue={subjectId ?? undefined}
            onChange={(value) => setSubjectId(value)}
            placeholder={t("select_an_option")}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="slot-start">{t("start_time")}</Label>
            <Input
              id="slot-start"
              type="time"
              value={slotStart}
              onChange={(event) => setSlotStart(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-end">{t("end_time")}</Label>
            <Input
              id="slot-end"
              type="time"
              value={slotEnd}
              onChange={(event) => setSlotEnd(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Days</Label>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((weekday) => (
              <Button
                key={weekday}
                type="button"
                size="sm"
                variant={weekdays.includes(weekday) ? "default" : "outline"}
                className={cn(
                  "capitalize",
                  weekdays.includes(weekday) ? "font-medium" : "font-normal",
                )}
                onClick={() => {
                  setWeekdays((currentWeekdays) => {
                    if (currentWeekdays.includes(weekday)) {
                      return currentWeekdays.filter((day) => day !== weekday);
                    }
                    return [...currentWeekdays, weekday];
                  });
                }}
              >
                {getWeekdayName(weekday, locale)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={queueCurrentSlot} disabled={isBusy}>
          Queue Slot
        </Button>
        <Button
          type="button"
          onClick={createCurrentSlot}
          disabled={isBusy || subjectsQuery.isPending || (subjectsQuery.data?.length ?? 0) === 0}
        >
          {t("create")}
        </Button>
        {queuedSlots.length > 0 && (
          <Button type="button" onClick={createQueuedSlots} disabled={isBusy}>
            Create queued ({queuedSlots.length})
          </Button>
        )}
        <Button type="button" variant="ghost" className="ml-auto" onClick={closeModal}>
          {t("close")}
        </Button>
      </div>

      {queuedSlots.length > 0 && (
        <div className="space-y-2">
          <Label>Queued slots</Label>
          <div className="space-y-2">
            {queuedSlots.map((slot) => (
              <div
                key={slot.id}
                className="bg-muted/30 flex items-center gap-2 rounded-md border p-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {subjectById.get(slot.subjectId) ?? `${t("subject")} #${slot.subjectId}`}
                  </div>
                  <div className="text-muted-foreground truncate text-xs capitalize">
                    {slot.weekdays.map((day) => getWeekdayName(day, locale)).join(", ")} ·{" "}
                    {slot.start} - {slot.end}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setQueuedSlots((currentSlots) =>
                      currentSlots.filter((currentSlot) => currentSlot.id !== slot.id),
                    );
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
