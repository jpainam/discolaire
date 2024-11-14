"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
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

import { DatePicker } from "~/components/shared/date-picker";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { api } from "~/trpc/react";

const schema = z.object({
  termId: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
  value: z.coerce.number().default(1),
});
export function CreateEditAbsence({
  absence,
}: {
  absence?: RouterOutputs["absence"]["all"][number];
}) {
  const form = useForm({
    schema: schema,
    defaultValues: {
      date: absence?.date ?? new Date(),
      value: absence?.value ?? 1,
    },
  });
  const utils = api.useUtils();
  const createAbsenceMutation = api.absence.create.useMutation({
    onSettled: () => {
      void utils.attendance.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
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
      termId: parseInt(data.termId),
    };
    if (absence) {
      toast.loading(t("updating"), { id: 0 });
      updateAbsenceMutation.mutate({ ...values, id: absence.id });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createAbsenceMutation.mutate(values);
    }
  };
  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
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
                <DatePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("number")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("number_of_absence")}
                  {...field}
                  defaultValue={absence?.value.toString()}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
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
          <Button size={"sm"} type={"submit"}>
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
