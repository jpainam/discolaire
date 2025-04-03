"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import type { Option } from "~/components/multiselect";
import MultipleSelector from "~/components/multiselect";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { api } from "~/trpc/react";

const createEditTimetable = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  description: z.string().optional(),
  days: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .default([]),
  repeat: z
    .enum(["daily", "weekly", "biweekly", "monthly", "yearly"])
    .default("weekly"),
  subjectId: z.string().min(1),
});
export function CreateEditTimetable({
  timetableId,
  start,
  end,
  days,
  description,
  subjectId,
  classroomId,
}: {
  timetableId?: string;
  start?: Date;
  end?: Date;
  days?: { label: string; value: string }[];
  description?: string | null;
  subjectId?: number;
  classroomId: string;
}) {
  const startTimeString = start
    ? start.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "08:00";
  const endTimeString = end
    ? end.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "09:00";
  const form = useForm({
    schema: createEditTimetable,
    defaultValues: {
      startTime: startTimeString,
      endTime: endTimeString,
      description: description ?? "",
      subjectId: subjectId ? `${subjectId}` : "",
      days: days ?? [],
    },
  });
  const { t } = useLocale();
  const utils = api.useUtils();
  const { closeModal } = useModal();

  const createTimetableMutation = api.timetable.create.useMutation({
    onSettled: async () => {
      await utils.timetable.invalidate();
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
      description: data.description,
      subjectId: Number(data.subjectId),
      repeat: data.repeat,
      daysOfWeek: data.days.map((day) => day.value),
      startDate: start ?? new Date(),
    };
    if (timetableId) {
      //
    } else {
      toast.loading(t("creating"), { id: 0 });
      createTimetableMutation.mutate(values);
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="grid gap-x-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("subject")}</FormLabel>
                <FormControl>
                  <SubjectSelector
                    defaultValue={subjectId ? `${subjectId}` : undefined}
                    classroomId={classroomId}
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
        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("week_days")}</FormLabel>
              <FormControl>
                <MultipleSelector
                  commandProps={{
                    label: t("select_options"),
                  }}
                  value={field.value}
                  defaultOptions={daysOptions}
                  onChange={(values) => {
                    field.onChange(values);
                  }}
                  //options={daysOptions}
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
                  <Input
                    type="time"
                    onChange={(e) => field.onChange(e.target.value)}
                  />
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
                  <Input
                    type="time"
                    onChange={(e) => field.onChange(e.target.value)}
                  />
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

// const getUniqueWeekdaysBetweenDates = (
//   startDate: Date,
//   endDate: Date
// ): string[] => {
//   const dayNames = [
//     "sunday",
//     "monday",
//     "tuesday",
//     "wednesday",
//     "thursday",
//     "friday",
//     "saturday",
//   ];
//   const uniqueWeekdays = new Set<string>();

//   const currentDate = new Date(startDate);

//   while (currentDate < endDate) {
//     const dayIndex = currentDate.getDay(); // Get day index (0 for Sunday, 1 for Monday, etc.)
//     // @ts-expect-error TODO: fix this
//     uniqueWeekdays.add(dayNames[dayIndex]); // Add to Set for uniqueness

//     // Increment the date by 1 day
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return Array.from(uniqueWeekdays); // Convert the Set back to an array
// };
