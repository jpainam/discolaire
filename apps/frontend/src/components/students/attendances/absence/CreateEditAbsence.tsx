"use client";

import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

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
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

import { DatePicker } from "~/components/DatePicker";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  date: z.coerce.date().default(() => new Date()),
  value: z.coerce.number().default(1),
  notify: z.boolean().default(true),
  justify: z.coerce.number().default(0),
});
export function CreateEditAbsence({
  absence,
  termId,
}: {
  absence?: RouterOutputs["absence"]["all"][number];
  termId: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: absence?.date ?? new Date(),
      value: absence?.value ?? 1,
      justify: 0,
      notify: true,
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAbsenceMutation = useMutation(
    trpc.absence.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        await queryClient.invalidateQueries(trpc.absence.pathFilter());

        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateAbsenceMutation = useMutation(
    trpc.absence.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const { closeModal } = useModal();
  const handleSubmit = (data: z.infer<typeof schema>) => {
    const values = {
      studentId: params.id,
      value: data.value,
      justify: data.justify,
      notify: data.notify,
      date: data.date,
      termId: termId,
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
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
            size={"sm"}
            type={"button"}
          >
            {t("close")}
          </Button>
          <Button
            isLoading={
              createAbsenceMutation.isPending || updateAbsenceMutation.isPending
            }
            size={"sm"}
            type={"submit"}
          >
            {absence ? t("edit") : t("add")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
