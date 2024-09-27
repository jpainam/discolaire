"use client";

import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "@repo/hooks/use-locale";
import { useModal } from "@repo/hooks/use-modal";
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

import "react-datepicker/dist/react-datepicker.css";

import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { api } from "~/trpc/react";

const createEditTimetable = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
  description: z.string().optional(),
  subjectId: z.coerce.number(),
});
export function CreateEditTimetable({
  timetableId,
  start,
  end,
  description,
  subjectId,
  classroomId,
}: {
  timetableId?: string;
  start?: Date;
  end?: Date;
  description?: string | null;
  subjectId?: number;
  classroomId: string;
}) {
  const form = useForm({
    schema: createEditTimetable,
    defaultValues: {
      start: start ?? new Date(),
      end: end ?? new Date(),
      description: description ?? "",
      subjectId: subjectId ? subjectId : 0,
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

  const handleSubmit = (data: z.infer<typeof createEditTimetable>) => {
    const values = {
      start: data.start,
      end: data.end,
      description: data.description,
      subjectId: Number(data.subjectId),
    };
    if (timetableId) {
      //
    } else {
      createTimetableMutation.mutate(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>
                {t("description")}
                {start?.toISOString()} {end?.toISOString()}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-x-4">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("start_date")}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    defaultValue={field.value.toLocaleTimeString()}
                    onChange={(e) => {
                      form.setValue("start", new Date(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("end_date")}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    defaultValue={field.value.toISOString()}
                    onChange={(e) => {
                      form.setValue("end", new Date(e.target.value));
                    }}
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
