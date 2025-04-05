"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { DatePicker } from "~/components/DatePicker";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";

const schema = z.object({
  termId: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
  duration: z.coerce.number(),
  // hours: z.string().min(1),
  // minutes: z.string().min(1),
});
export function CreateEditLateness({
  lateness,
}: {
  lateness?: RouterOutputs["lateness"]["all"][number];
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: lateness?.date ?? new Date(),
      termId: lateness?.termId ? `${lateness.termId}` : "",
      duration: lateness?.duration ?? 0,
      // hours: lateness?.duration
      //   ? Math.floor(lateness.duration / 60).toString()
      //   : "0",
      // minutes: lateness?.duration ? (lateness.duration % 60).toString() : "0",
    },
  });
  const utils = api.useUtils();
  const router = useRouter();
  const createLatenessMutation = api.lateness.create.useMutation({
    onSettled: () => {
      void utils.attendance.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const updateLatenessMutation = api.lateness.update.useMutation({
    onSettled: () => {
      void utils.attendance.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
      router.refresh();
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
      duration: Number(data.duration), //parseInt(data.hours) * 60 + parseInt(data.minutes),
      termId: parseInt(data.termId),
    };
    if (lateness) {
      toast.loading(t("updating"), { id: 0 });
      updateLatenessMutation.mutate({ ...values, id: lateness.id });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createLatenessMutation.mutate(values);
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
                <DatePicker defaultValue={field.value} {...field} />
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
                <Input type="number" {...field} />
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
              createLatenessMutation.isPending ||
              updateLatenessMutation.isPending
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
