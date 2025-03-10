"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { DatePicker } from "~/components/DatePicker";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const schema = z.object({
  termId: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
  value: z.coerce.number().default(1),
  justify: z.coerce.number().default(0),
  notify: z.boolean().default(true),
});
export function CreateEditAbsence({
  absence,
  classroomId,
}: {
  absence?: RouterOutputs["absence"]["all"][number];
  classroomId: string;
}) {
  const form = useForm({
    schema: schema,
    defaultValues: {
      date: absence?.date ?? new Date(),
      value: absence?.value ?? 1,
      justify: absence?.justification?.value ?? 0,
      notify: true,
    },
  });
  const utils = api.useUtils();
  const createAbsenceMutation = api.absence.create.useMutation({
    onSettled: () => {
      void utils.attendance.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const updateAbsenceMutation = api.absence.update.useMutation({
    onSettled: () => {
      void utils.attendance.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const { closeModal } = useModal();
  const handleSubmit = (data: z.infer<typeof schema>) => {
    const values = {
      studentId: params.id,
      value: data.value,
      justify: data.justify,
      termId: parseInt(data.termId),
    };
    if (absence) {
      toast.loading(t("updating"), { id: 0 });
      updateAbsenceMutation.mutate({ ...values, id: absence.id });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createAbsenceMutation.mutate(
        { ...values, classroomId: classroomId },
        {
          onSuccess: (att) => {
            if (data.notify) {
              fetch("/api/emails/attendance", {
                method: "POST",
                body: JSON.stringify({ id: att.id, type: "absence" }),
              })
                .then((res) => {
                  if (res.ok) {
                    toast.success(t("sent_successfully"), { id: 0 });
                  } else {
                    toast.error(t("error_sending"), { id: 0 });
                  }
                })
                .catch((error) => {
                  toast.error(getErrorMessage(error), { id: 0 });
                });
            }
          },
        },
      );
    }
  };
  return (
    <Form {...form}>
      <form className="grid gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="termId"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("terms")}</FormLabel>
              <FormControl>
                <TermSelector {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("date")}</FormLabel>
              <FormControl>
                <DatePicker defaultValue={field.value} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("absences")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("absences")}
                    {...field}
                    defaultValue={absence?.value.toString()}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="justify"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("justified")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("justified")}
                    {...field}
                    defaultValue={absence?.value.toString()}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notify"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox onCheckedChange={(v) => field.onChange(v)} />
              </FormControl>
              <FormLabel>{t("notify_parents")}?</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
            size={"sm"}
            type={"button"}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createAbsenceMutation.isPending || updateAbsenceMutation.isPending
            }
            size={"sm"}
            type={"submit"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
