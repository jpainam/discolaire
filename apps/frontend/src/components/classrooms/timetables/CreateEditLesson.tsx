"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import type { Option } from "~/components/students/multiple-selector";
import MultipleSelector from "~/components/students/multiple-selector";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { api } from "~/trpc/react";

const createEditTimetable = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  days: z.array(z.string()).default([]),
  subjectId: z.string().min(1),
  repeat: z
    .enum(["daily", "weekly", "biweekly", "monthly", "yearly"])
    .default("weekly"),
});
export function CreateEditLesson({
  lessonId,
  startTime,
  endTime,
  days,
  start,
  subjectId,
}: {
  lessonId?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  start?: Date;
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
      repeat: "weekly",
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

  const daysOptions: Option[] = [
    {
      label: t("monday"),
      value: "monday",
    },
    {
      label: t("tuesday"),
      value: "tuesday",
    },
    {
      label: t("wednesday"),
      value: "wednesday",
    },
    {
      label: t("thursday"),
      value: "thursday",
    },
    {
      label: t("friday"),
      value: "friday",
    },
    {
      label: t("saturday"),
      value: "saturday",
    },
    {
      label: t("sunday"),
      value: "sunday",
    },
  ];

  const handleSubmit = (data: z.infer<typeof createEditTimetable>) => {
    if (!data.subjectId) {
      toast.error(t("subject_required"), { id: 0 });
      return;
    }

    const values = {
      startTime: data.startTime,
      endTime: data.endTime,
      subjectId: Number(data.subjectId),
      repeat: data.repeat,
      daysOfWeek: data.days,
      startDate: start ?? new Date(),
    };
    if (lessonId) {
      toast.loading(t("updating"), { id: 0 });
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
        <div className="grid grid-cols-2 gap-x-4">
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
            name="repeat"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("repeat")} ?</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={"weekly"}
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("repeat")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t("daily")}</SelectItem>
                      <SelectItem value="weekly">{t("weekly")}</SelectItem>
                      <SelectItem value="biweekly">{t("biweekly")}</SelectItem>
                      <SelectItem value="monthly">{t("monthly")}</SelectItem>
                      <SelectItem value="yearly">{t("yearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("week_days")}</FormLabel>
              <FormControl>
                <MultipleSelector
                  //{...field}

                  defaultOptions={daysOptions.filter((day) =>
                    field.value?.includes(day.value)
                  )}
                  onChange={(values) => {
                    field.onChange(values.map((v) => v.value));
                  }}
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
          <Button
            type="submit"
            isLoading={createLessonMutation.isPending}
            size={"sm"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
