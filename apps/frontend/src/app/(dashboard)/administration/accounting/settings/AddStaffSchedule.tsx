"use client";

import { SaveIcon, XIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { api } from "~/trpc/react";
import { cronValues } from "./cron-values";

const addStaffScheduleSchema = z.object({
  cron: z.string().min(1),
  staffId: z.string().min(1),
});
export function AddStaffSchedule({
  scheduleTask,
  staffId,
}: {
  staffId?: string;
  scheduleTask?: RouterOutputs["scheduleTask"]["all"][number];
}) {
  const { closeModal } = useModal();
  const form = useForm({
    schema: addStaffScheduleSchema,
    defaultValues: {
      cron: scheduleTask?.cron ?? "0 18 * * *",
      staffId: staffId ?? "",
    },
  });

  const createScheduleTask = api.scheduleTask.create.useMutation({
    onSettled: () => {
      void utils.scheduleTask.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateScheduleTask = api.scheduleTask.update.useMutation({
    onSettled: () => {
      void utils.scheduleTask.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const utils = api.useUtils();

  const handleSubmit = (data: z.infer<typeof addStaffScheduleSchema>) => {
    const values = {
      cron: data.cron,
      data: {
        staffId: data.staffId,
      },
      name: "transaction-summary",
    };
    if (scheduleTask) {
      toast.loading(t("updating"), { id: 0 });
      updateScheduleTask.mutate({ ...values, id: scheduleTask.id });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createScheduleTask.mutate(values);
    }
  };

  const { t } = useLocale();

  return (
    <Form {...form}>
      <form className="grid gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("staff")}</FormLabel>
              <FormControl>
                <StaffSelector onChange={(val) => field.onChange(val)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cron"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("frequence")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => field.onChange(val)}
                  defaultValue={"0 18 * * *"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("frequence")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cronValues.map((cron, index) => {
                      return (
                        <SelectItem
                          key={`${cron.value}-${index}`}
                          value={cron.value}
                        >
                          {t(cron.name)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
          >
            <XIcon className="mr-2 h-4 w-4" />
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createScheduleTask.isPending || updateScheduleTask.isPending
            }
            type="submit"
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
