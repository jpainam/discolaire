"use client";

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
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const justifySchema = z.object({
  reason: z.string().min(1),
  comment: z.string().min(1),
  value: z.string().min(1),
});
export function JustifyAbsence({
  absence,
}: {
  absence:
    | RouterOutputs["absence"]["get"]
    | RouterOutputs["absence"]["byClassroom"][number];
}) {
  const { closeModal } = useModal();

  const utils = api.useUtils();
  const form = useForm({
    resolver: zodResolver(justifySchema),
    defaultValues: {
      reason: "",
      comment: "",
      value: absence.value ? absence.value.toString() : "0",
    },
  });
  const router = useRouter();
  const justifyMutation = api.absence.justify.useMutation({
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSettled: () => {
      void utils.absence.invalidate();
      closeModal();
    },
  });
  const handleSubmit = (data: z.infer<typeof justifySchema>) => {
    if (Number(data.value) <= 0 || Number(data.value) > absence.value) {
      toast.error(`Must be >= 0 or <= ${absence.value}`);
      return;
    }
    const values = {
      reason: data.reason,
      absenceId: absence.id,
      value: Number(data.value),
    };
    justifyMutation.mutate(values);
  };
  const { i18n, t } = useLocale();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="border-b">
          {t("date")}{" "}
          <span>
            {Intl.DateTimeFormat(i18n.language, {
              weekday: "short",
              month: "short",
              day: "numeric",
            }).format(absence.date)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("number")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
          <Button isLoading={justifyMutation.isPending} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
