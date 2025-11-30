/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import type { SubmitHandler } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";

import { InputField } from "~/components/shared/forms/input-field";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { useModal } from "~/hooks/use-modal";
import { getErrorMessage } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

//const isSchoolYear = (data: any) => data.calendarType === "School Year";
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const isTeaching = (data: any) => data.calendarType === "Teaching";
//const isHoliday = (data: any) => data.calendarType === "Holidays";

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
  RouterOutputs["calendarEvent"]["all"]
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

  const t = useTranslations();
  const isUpdateEvent = event !== undefined;

  //const parsedCalendarData = parseCalendarEventData(event);
  const form = useForm({
    resolver: standardSchemaResolver(eventFormSchema),
    defaultValues: {
      calendarType: event?.calendarTypeId ? `${event.calendarTypeId}` : "",
      title: event?.title ?? "",
      classroom: "",
      subject: "",
      description: event?.description ?? "",
      startDate: startDate ?? event?.start,
      endDate: endDate ?? event?.end,
    },
  });

  const { register, setValue, handleSubmit, watch, clearErrors } = form;

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedCalendarType = watch("calendarType");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");
  const watchedClassroomId = watch("classroom");
  const watchedSubject = watch("subject");

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const createCalendarEventMutation = useMutation(
    trpc.calendarEvent.create.mutationOptions(),
  );
  const updateCalendarEventMutation = useMutation(
    trpc.calendarEvent.update.mutationOptions(),
  );
  const deleteCalendarEventMutation = useMutation(
    trpc.calendarEvent.delete.mutationOptions(),
  );

  const onSubmit: SubmitHandler<EventFormInput> = (data) => {
    const eventData = {
      classroomId: data.classroom,
    };
    const newEvent = {
      data: eventData,
      start: data.startDate,
      description: data.description ?? "",
      title: data.title,
      alert: data.alert,
      repeat: data.repeat,
      calendarTypeId: data.calendarType ? Number(data.calendarType) : null,
      end: data.endDate,
    };

    if (event) {
      toast.promise(
        updateCalendarEventMutation.mutateAsync({ id: event.id, ...newEvent }),
        {
          loading: t("updating"),
          error: (error) => {
            return getErrorMessage(error);
          },
          success: async () => {
            await queryClient.invalidateQueries(
              trpc.calendarEvent.all.pathFilter(),
            );
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
        success: async () => {
          await queryClient.invalidateQueries(
            trpc.calendarEvent.all.pathFilter(),
          );
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
        success: async () => {
          await queryClient.invalidateQueries(
            trpc.calendarEvent.all.pathFilter(),
          );
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
                      onSelect={(value) => {
                        field.onChange(value);
                        setValue("subject", "");
                      }}
                      defaultValue={watchedClassroomId ?? ""}
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
                      classroomId={watchedClassroomId ?? ""}
                      className="h-10"
                      defaultValue={watchedSubject ?? undefined}
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
              <FormControl></FormControl>
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
              <FormControl></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={cn("col-span-full mt-4 grid grid-cols-2 gap-2")}>
          <Button
            variant={isUpdateEvent ? "default" : "outline"}
            className={cn(
              "w-full @xl:w-auto",
              isUpdateEvent
                ? "bg-red-600 text-white hover:border-none hover:bg-red-700 hover:text-white hover:ring-0"
                : "dark:hover:border-gray-400",
            )}
            onClick={() => (isUpdateEvent ? deleteEvent() : closeModal())}
          >
            {isUpdateEvent ? "Delete" : "Cancel"}
          </Button>

          <Button type="submit" className="hover:gray-700 w-full @xl:w-auto">
            {isUpdateEvent ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
