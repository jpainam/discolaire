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
} from "@repo/ui/components/form";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { useTRPC } from "~/trpc/react";

const createEditTimetable = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  categoryId: z.string().min(1),
  dayOfWeek: z.coerce.number().positive(), // 0-6 (Sunday-Saturday)
  subjectId: z.string().min(1),
  repeat: z
    .enum(["daily", "weekly", "biweekly", "monthly", "yearly"])
    .default("weekly"),
});
export function CreateEditLesson({
  lessonId,
  categoryId,
  startTime,
  endTime,
  dayOfWeek,
  start,
  subjectId,
}: {
  lessonId?: string;
  startTime?: string;
  endTime?: string;
  categoryId?: string;
  category?: string;
  dayOfWeek?: number;
  start?: Date;
  subjectId?: number;
}) {
  const params = useParams<{ id: string }>();

  const form = useForm({
    resolver: zodResolver(createEditTimetable),
    defaultValues: {
      startTime: startTime ?? "08:00",
      categoryId: categoryId ?? "",
      endTime: endTime ?? "09:00",
      subjectId: subjectId ? `${subjectId}` : "",
      dayOfWeek: dayOfWeek ?? 0,
      repeat: "weekly" as const,
    },
  });
  const trpc = useTRPC();
  const categoryQuery = useQuery(trpc.timetableCategory.all.queryOptions());
  const queryClient = useQueryClient();

  const { t } = useLocale();

  const { closeModal } = useModal();
  const hours24 = useMemo(() => {
    const t = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        t.push(`${hour}:${minute}`);
      }
    }
    return t;
  }, []);

  const watchStartTime = form.watch("startTime");

  const filteredEndTimes = useMemo(() => {
    if (!watchStartTime) return hours24; // if no start time selected, show all
    const startIndex = hours24.indexOf(watchStartTime);
    return hours24.slice(startIndex + 1); // exclude startTime and earlier
  }, [watchStartTime, hours24]);

  const createLessonMutation = useMutation(
    trpc.lesson.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.lesson.pathFilter());
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
      subjectId: Number(data.subjectId),
      repeat: data.repeat,
      categoryId: data.categoryId,
      dayOfWeek: Number(data.dayOfWeek),
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
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
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

        {categoryQuery.isPending ? (
          <Skeleton className="h-8" />
        ) : (
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("category")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryQuery.data?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-2 gap-x-4">
          <FormField
            control={form.control}
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("week_days")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("week_days")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 7 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {t(getDayOfWeek(i))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeat"
            render={({ field }) => (
              <FormItem>
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
        <div className="grid grid-cols-2 gap-x-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("start_time")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("start_time")} />
                    </SelectTrigger>
                    <SelectContent>
                      {hours24.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("end_time")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("end_time")} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredEndTimes.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
