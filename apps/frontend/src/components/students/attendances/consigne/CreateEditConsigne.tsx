"use client";

import { useParams } from "next/navigation";
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
import { Textarea } from "@repo/ui/components/textarea";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/ui/components/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { DatePicker } from "~/components/DatePicker";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  termId: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
  duration: z.coerce.number(),
  task: z.string().min(1),
});
export function CreateEditConsigne({
  consigne,
}: {
  consigne?: RouterOutputs["consigne"]["all"][number];
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: consigne?.date ?? new Date(),
      termId: consigne?.termId ? `${consigne.termId}` : "",
      duration: consigne?.duration ?? 0,
      task: consigne?.task ?? "",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createConsigneMutation = useMutation(
    trpc.consigne.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.consigne.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateConsigneMutation = useMutation(
    trpc.consigne.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.consigne.all.pathFilter());
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
      //duration: parseInt(data.hours) * 60 + parseInt(data.minutes),
      duration: Number(data.duration),
      termId: data.termId,
      date: data.date,
      task: data.task,
    };
    if (consigne) {
      toast.loading(t("updating"), { id: 0 });
      updateConsigneMutation.mutate({ ...values, id: consigne.id });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createConsigneMutation.mutate(values);
    }
  };
  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="termId"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>{t("date")}</FormLabel>
              <FormControl>
                <DatePicker
                  defaultValue={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("duration")}</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("task")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
          <Button
            isLoading={
              createConsigneMutation.isPending ||
              updateConsigneMutation.isPending
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
