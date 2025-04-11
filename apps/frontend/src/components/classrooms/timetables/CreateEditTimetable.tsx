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
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import MultipleSelector from "~/components/multiselect";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { useTRPC } from "~/trpc/react";

const createEditTimetable = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  description: z.string().optional(),
  daysOfWeek: z.array(z.coerce.number()).default([]),
  repeat: z
    .enum(["daily", "weekly", "biweekly", "monthly", "yearly"])
    .default("weekly"),
  subjectId: z.string().min(1),
});
export function CreateEditTimetable({
  timetableId,
  start,
  end,
  daysOfWeek,
  description,
  subjectId,
  classroomId,
}: {
  timetableId?: string;
  start?: Date;
  end?: Date;
  daysOfWeek?: number[]; // 0..6 Sundays .. Saturday
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
    resolver: zodResolver(createEditTimetable),
    defaultValues: {
      startTime: startTimeString,

      endTime: endTimeString,
      repeat: "weekly" as const,
      description: description ?? "",
      subjectId: subjectId ? `${subjectId}` : "",
      daysOfWeek: daysOfWeek ?? [],
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { t } = useLocale();

  const { closeModal } = useModal();

  const createTimetableMutation = useMutation(
    trpc.timetable.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.timetable.classroom.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const getDayOfWeek = (dayNumber: number): string => {
    return dayNames[dayNumber] ?? "";
  };

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
      daysOfWeek: data.daysOfWeek,
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
          name="daysOfWeek"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("week_days")}</FormLabel>
              <FormControl>
                <MultipleSelector
                  commandProps={{
                    label: t("select_options"),
                  }}
                  value={field.value.map((day, index) => {
                    return {
                      label: t(getDayOfWeek(day)),
                      value: `${index}`,
                    };
                  })}
                  defaultOptions={dayNames.map((day, index) => {
                    return {
                      label: t(day),
                      value: `${index}`,
                    };
                  })}
                  onChange={(values) => {
                    field.onChange(values.map((val) => Number(val.value)));
                  }}
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
