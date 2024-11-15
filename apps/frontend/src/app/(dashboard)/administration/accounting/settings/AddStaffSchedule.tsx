"use client";

import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
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
import { useSchool } from "~/contexts/SchoolContext";
import { api } from "~/trpc/react";

const addStaffScheduleSchema = z.object({
  cron: z.string().min(1),
  staffId: z.string().min(1),
  timezone: z.string().min(1),
});
export function AddStaffSchedule({
  timezones,
  staffs,
}: {
  timezones: string[];
  staffs: RouterOutputs["staff"]["all"];
}) {
  const { closeModal } = useModal();
  const form = useForm({
    schema: addStaffScheduleSchema,
  });
  const createScheduleJob = api.scheduleJob.create.useMutation();
  const handleSubmit = (data: z.infer<typeof addStaffScheduleSchema>) => {
    const userId = staffs.find((staff) => staff.id === data.staffId)?.userId;
    if (!userId) {
      toast.error("Staff not link to a user");
      return;
    }
    const values = {
      userId: userId,
      cron: data.cron,
      timezone: data.timezone,
    };
    void fetch("/api/trigger/transaction-summary", {
      method: "POST",
      body: JSON.stringify(values),
    }).then(async (response) => {
      const json = (await response.json()) as { id: string };
      createScheduleJob.mutate({
        ...values,
        triggerDevId: json.id,
        type: "transaction-summary",
      });
      closeModal();
    });
  };
  const { school } = useSchool();
  const { t } = useLocale();

  return (
    <Form {...form}>
      <form className="grid gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
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
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("timezones")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => field.onChange(val)}
                  defaultValue={school.timezone}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("timezones")} />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => {
                      return (
                        <SelectItem value={timezone}>{timezone}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cron"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("frequence")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => field.onChange(val)}
                  defaultValue={school.timezone}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("frequence")} />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => {
                      return (
                        <SelectItem value={timezone}>{timezone}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
