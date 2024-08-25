"use client";

import { DateTimePicker } from "@/components/shared/date-time-picker";
import { InputField } from "@/components/shared/forms/input-field";
import { ClassroomSelector } from "@/components/shared/selects/ClassroomSelector";
import { SubjectSelector } from "@/components/shared/selects/SubjectSelector";
import { useLocale } from "@/hooks/use-locale";
import { useModal } from "@/hooks/use-modal";
import { getErrorMessage } from "@/lib/handle-error";
import { cn } from "@/lib/utils";
import { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { inferProcedureOutput } from "@trpc/server";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const isSchoolYear = (data: any) => data.calendarType === "School Year";
const isTeaching = (data: any) => data.calendarType === "Teaching";
const isHoliday = (data: any) => data.calendarType === "Holidays";

const eventFormSchema = z
  .object({
    id: z.string().optional(),
    calendarType: z.string().optional().default(""),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    classroom: z.string().optional(),
    subject: z.string().optional(),
    repeat: z
      .enum(["None", "Daily", "Weekly", "Monthly", "Yearly"])
      .optional()
      .default("None"),
    alert: z
      .enum(["None", "15min", "30min", "1hour"])
      .optional()
      .default("None"),
    startDate: z.date({
      required_error: "Start Date is required",
    }),
    endDate: z.date({
      required_error: "End Date is required",
    }),
  })
  .superRefine((data, ctx) => {
    // Conditional validation for Teaching Calendar
    if (isTeaching(data)) {
      if (!data.classroom) {
        ctx.addIssue({
          path: ["classroom"],
          message: "Classroom is required when calendar type is Teaching",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.subject) {
        ctx.addIssue({
          path: ["subject"],
          message: "Subject is required when calendar type is Teaching",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

// generate form types from zod validation schema
type EventFormInput = z.infer<typeof eventFormSchema>;

type CalendarEventProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["calendarEvent"]["all"]>
>[number];

interface CreateEventProps {
  startDate?: Date;
  endDate?: Date;
  event?: CalendarEventProcedureOutput;
}

export default function EventForm({
  startDate,
  endDate,
  event,
}: CreateEventProps) {
  const { closeModal } = useModal();
  const { t } = useLocale();
  const isUpdateEvent = event !== undefined;

  //const parsedCalendarData = parseCalendarEventData(event);
  const form = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      calendarType: event?.calendarTypeId ? `${event?.calendarTypeId}` : "",
      title: event?.title ?? "",
      classroom: "",
      subject: "",
      description: event?.description ?? "",
      startDate: startDate ?? event?.start,
      endDate: endDate ?? event?.end,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = form;

  const watchedCalendarType = watch("calendarType");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");
  const watchedClassroomId = watch("classroom");
  const watchedSubject = watch("subject");

  const utils = api.useUtils();
  const createCalendarEventMutation = api.calendarEvent.create.useMutation();
  const updateCalendarEventMutation = api.calendarEvent.update.useMutation();
  const deleteCalendarEventMutation = api.calendarEvent.delete.useMutation();

  const onSubmit: SubmitHandler<EventFormInput> = (data) => {
    const eventData = {
      classroomId: data.classroom,
    };
    const newEvent = {
      data: eventData,
      start: data?.startDate,
      description: data.description || "",
      title: data.title,
      alert: data.alert,
      repeat: data.repeat,
      calendarTypeId: data.calendarType ? Number(data.calendarType) : null,
      end: data?.endDate,
    };

    if (event) {
      toast.promise(
        updateCalendarEventMutation.mutateAsync({ id: event.id, ...newEvent }),
        {
          loading: t("updating"),
          error: (error) => {
            return getErrorMessage(error);
          },
          success: () => {
            utils.calendarEvent.all.invalidate();
            return t("updated_successfully");
          },
        },
      );
    } else {
      toast.promise(createCalendarEventMutation.mutateAsync(newEvent), {
        loading: t("adding"),
        error: (error) => {
          return getErrorMessage(error);
        },
        success: () => {
          utils.calendarEvent.all.invalidate();
          return t("added_successfully");
        },
      });
    }

    closeModal();
  };

  const deleteEvent = () => {
    if (event) {
      toast.promise(deleteCalendarEventMutation.mutateAsync(event.id), {
        loading: t("deleting"),
        error: (error) => {
          return getErrorMessage(error);
        },
        success: () => {
          utils.calendarEvent.all.invalidate();
          return t("deleted_successfully");
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="@container grid grid-cols-1 gap-x-4 gap-y-1 md:grid-cols-2"
      >
        <input type="hidden" {...register("id")} defaultValue={event?.id} />
        <div className="col-span-full">
          <Label>Calendar Type</Label>
          <Select
            defaultValue={watch("calendarType")}
            onValueChange={(val) =>
              setValue(
                "calendarType",
                val as "School Year" | "Teaching" | "Holidays",
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select calendar type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Calendar Type</SelectLabel>
                <SelectItem value="School Year">
                  School Year Calendar
                </SelectItem>
                <SelectItem value="Teaching">Teaching Calendar</SelectItem>
                <SelectItem value="Holidays">Holidays Calendar</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <InputField
          label="Title"
          placeholder="Enter a name of event"
          name="title"
          className="col-span-full"
        />

        {watchedCalendarType === "Teaching" && (
          <>
            <FormField
              control={form.control}
              name={"classroom"}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="classroom" className="text-sm">
                    {t("classroom")}
                  </FormLabel>
                  <FormControl>
                    <ClassroomSelector
                      className="w-full"
                      onChange={(value) => {
                        field.onChange(value);
                        setValue("subject", "");
                      }}
                      defaultValue={watchedClassroomId || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="w-full space-y-1">
                  <FormLabel>{t("subject")}</FormLabel>
                  <FormControl>
                    <SubjectSelector
                      onChange={field.onChange}
                      classroomId={watchedClassroomId || ""}
                      className="h-10"
                      defaultValue={watchedSubject || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="col-span-full">
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Enter your event description"
            name="description"
            rows={2}
          />
        </div>

        {watchedCalendarType != "Holidays" && (
          <div>
            <label className="text-[14px] font-medium">Repeat</label>
            <Select
              defaultValue={watch("repeat")}
              onValueChange={(val) =>
                setValue(
                  "repeat",
                  val as "None" | "Daily" | "Weekly" | "Monthly" | "Yearly",
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Repeat</SelectLabel>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        <div
          className={` ${watchedCalendarType === "Holidays" ? "col-span-full" : ""}`}
        >
          <Label>Alert</Label>
          <Select
            defaultValue={watch("alert")}
            onValueChange={(val) =>
              setValue("alert", val as "None" | "15min" | "30min" | "1hour")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Alert" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Alert</SelectLabel>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="15min">15min</SelectItem>
                <SelectItem value="30min">30min</SelectItem>
                <SelectItem value="1hour">1hour</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <DateTimePicker
                  placeholder="Event Start Date"
                  className="mt-1"
                  onChange={(date) => {
                    setValue("startDate", date as Date);
                    clearErrors("startDate");
                  }}
                  defaultValue={watchedStartDate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date</FormLabel>
              <FormControl>
                <DateTimePicker
                  placeholder="Event End Date"
                  className="mt-1"
                  onChange={(date) => {
                    setValue("endDate", date as Date);
                    clearErrors("endDate");
                  }}
                  defaultValue={watchedEndDate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={cn("col-span-full mt-4 grid grid-cols-2 gap-2")}>
          <Button
            variant={isUpdateEvent ? "default" : "outline"}
            className={cn(
              "@xl:w-auto w-full",
              isUpdateEvent
                ? "bg-red-600 text-white hover:border-none hover:bg-red-700 hover:text-white hover:ring-0"
                : "dark:hover:border-gray-400",
            )}
            onClick={() => (isUpdateEvent ? deleteEvent() : closeModal())}
          >
            {isUpdateEvent ? "Delete" : "Cancel"}
          </Button>

          <Button type="submit" className="hover:gray-700 @xl:w-auto w-full">
            {isUpdateEvent ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
