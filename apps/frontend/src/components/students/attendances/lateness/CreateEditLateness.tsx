"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { DatePicker } from "~/components/shared/date-picker";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { api } from "~/trpc/react";

const schema = z.object({
  termId: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
  hours: z.string().min(1),
  minutes: z.string().min(1),
});
export function CreateEditLateness({
  lateness,
}: {
  lateness?: RouterOutputs["lateness"]["all"][number];
}) {
  const form = useForm({
    schema: schema,
    defaultValues: {
      date: lateness?.date ?? new Date(),
      hours: lateness?.duration
        ? Math.floor(lateness.duration / 60).toString()
        : "0",
      minutes: lateness?.duration ? (lateness.duration % 60).toString() : "0",
    },
  });
  const utils = api.useUtils();
  const createLatenessMutation = api.lateness.create.useMutation({
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
  const updateLatenessMutation = api.lateness.update.useMutation({
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
      duration: parseInt(data.hours) * 60 + parseInt(data.minutes),
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
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("hours")}</FormLabel>
                <FormControl>
                  <Select defaultValue={"0"} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("hours")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 23 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minutes"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("minutes")}</FormLabel>
                <FormControl>
                  <Select defaultValue={"0"} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("hours")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
            size={"sm"}
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
