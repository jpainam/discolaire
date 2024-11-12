"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { Option } from "@repo/ui/multiple-selector";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import MultipleSelector from "@repo/ui/multiple-selector";

import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { api } from "~/trpc/react";

const createEditTimetable = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  days: z.array(z.string()).default([]),
  subjectId: z.string().min(1),
});
export function CreateEditLesson({
  lessonId,
  startTime,
  endTime,
  days,
  subjectId,
}: {
  lessonId?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  subjectId?: number;
}) {
  const params = useParams<{ id: string }>();
  const form = useForm({
    schema: createEditTimetable,
    defaultValues: {
      startTime: startTime ?? "08:00",
      endTime: endTime ?? "09:00",
      subjectId: subjectId ? `${subjectId}` : "",
      days: days ?? [],
    },
  });
  const { t } = useLocale();
  const utils = api.useUtils();
  const { closeModal } = useModal();

  const createLessonMutation = api.lesson.create.useMutation({
    onSettled: async () => {
      await utils.lesson.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const daysOptions: Option<string>[] = [
    {
      label: t("sunday"),
      value: "0",
    },
    {
      label: t("monday"),
      value: "1",
    },
    {
      label: t("tuesday"),
      value: "2",
    },
    {
      label: t("wednesday"),
      value: "3",
    },
    {
      label: t("thursday"),
      value: "4",
    },
    {
      label: t("friday"),
      value: "5",
    },
    {
      label: t("saturday"),
      value: "6",
    },
  ];

  const handleSubmit = (data: z.infer<typeof createEditTimetable>) => {
    if (!data.subjectId) {
      toast.error(t("subject_required"), { id: 0 });
      return;
    }
    // Hack from https://github.com/prisma/prisma/issues/15454 Issue opened
    const dummyDate = "1970-01-01";
    const values = {
      startTime: new Date(dummyDate + "T" + data.startTime + "Z"),
      endTime: new Date(dummyDate + "T" + data.endTime + "Z"),
      subjectId: Number(data.subjectId),
      daysOfWeek: data.days.map(Number),
    };
    if (lessonId) {
      console.log("updating");
    } else {
      toast.loading(t("creating"), { id: 0 });
      createLessonMutation.mutate(values);
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("subject")}</FormLabel>
              <FormControl>
                <SubjectSelector
                  defaultValue={subjectId ? `${subjectId}` : undefined}
                  classroomId={params.id}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("week_days")}</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  // @ts-expect-error TODO: fix this
                  defaultOptions={form.getValues("days")}
                  options={daysOptions}
                  hidePlaceholderWhenSelected
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-x-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("start_date")}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("end_date")}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4 flex flex-row items-center justify-end gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            variant={"outline"}
            size={"sm"}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" size={"sm"}>
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
