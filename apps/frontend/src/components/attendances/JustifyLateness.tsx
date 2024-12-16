"use client";

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
import { Textarea } from "@repo/ui/textarea";

import { api } from "~/trpc/react";

const justifySchema = z.object({
  reason: z.string().min(1),
  comment: z.string().min(1),
  hours: z.string().min(1),
  minutes: z.string().min(1),
});
export function JustifyLateness({
  lateness,
}: {
  lateness: RouterOutputs["lateness"]["get"];
}) {
  const { closeModal } = useModal();

  const form = useForm({
    schema: justifySchema,
    defaultValues: {
      reason: "",
      comment: "",
      hours: lateness.duration
        ? Math.floor(lateness.duration / 60).toString()
        : "0",
      minutes: lateness.duration ? (lateness.duration % 60).toString() : "0",
    },
  });
  const justifyLatenessMutation = api.lateness.justify.useMutation();
  const handleSubmit = (data: z.infer<typeof justifySchema>) => {
    const values = {
      reason: data.reason,
      latenessId: lateness.id,
      duration: 0,
    };
    justifyLatenessMutation.mutate(values);
  };
  const { i18n, t } = useLocale();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="border-b">
          <span>
            {Intl.DateTimeFormat(i18n.language, {
              weekday: "short",
              month: "short",
              day: "numeric",
            }).format(lateness.date)}
          </span>
          <span className="text-muted-foreground">{lateness.duration}</span>
        </div>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reason")}?</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("comment")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            size={"sm"}
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{t("submit")}</Button>
        </div>
      </form>
    </Form>
  );
}
