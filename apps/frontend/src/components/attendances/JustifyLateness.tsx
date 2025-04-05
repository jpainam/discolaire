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
  duration: z.string().min(1),
  // hours: z.string().min(1),
  // minutes: z.string().min(1),
});
export function JustifyLateness({
  lateness,
}: {
  lateness:
    | RouterOutputs["lateness"]["get"]
    | RouterOutputs["lateness"]["byClassroom"][number];
}) {
  const { closeModal } = useModal();

  const utils = api.useUtils();
  const form = useForm({
    resolver: zodResolver(justifySchema),
    defaultValues: {
      reason: "",
      comment: "",
      duration: lateness.duration ? lateness.duration.toString() : "0",
      // hours: lateness.duration
      //   ? Math.floor(lateness.duration / 60).toString()
      //   : "0",
      // minutes: lateness.duration ? (lateness.duration % 60).toString() : "0",
    },
  });
  const router = useRouter();
  const justifyLatenessMutation = api.lateness.justify.useMutation({
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSettled: () => {
      void utils.lateness.invalidate();
      closeModal();
    },
  });
  const handleSubmit = (data: z.infer<typeof justifySchema>) => {
    if (Number(data.duration) <= 0) {
      toast.error(`Duration must >=0 and <= ${lateness.duration}`);
      return;
    }
    const values = {
      reason: data.reason,
      latenessId: lateness.id,
      duration: Number(data.duration),
    };
    justifyLatenessMutation.mutate(values);
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
            }).format(lateness.date)}
          </span>
          {/* <span className="text-muted-foreground">{lateness.duration}</span> */}
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
            name="duration"
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
          <Button isLoading={justifyLatenessMutation.isPending} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
