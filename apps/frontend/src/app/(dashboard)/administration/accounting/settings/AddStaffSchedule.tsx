"use client";

import { useState } from "react";
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
import { useSchool } from "~/contexts/SchoolContext";
import { api } from "~/trpc/react";
import { cronValues } from "./cron-values";

const addStaffScheduleSchema = z.object({
  cron: z.string().min(1),
  staffId: z.string().min(1),
  timezone: z.string().min(1),
});
export function AddStaffSchedule({
  timezones,
  staffs,
  scheduleJob,
}: {
  timezones: string[];
  scheduleJob?: RouterOutputs["scheduleJob"]["all"][number];
  staffs: RouterOutputs["staff"]["all"];
}) {
  const { closeModal } = useModal();
  const { school } = useSchool();
  const form = useForm({
    schema: addStaffScheduleSchema,
    defaultValues: {
      cron: scheduleJob?.cron ?? "0 18 * * *",
      staffId: scheduleJob
        ? staffs.find((staff) => staff.id === scheduleJob.userId)?.id
        : "",
      timezone: scheduleJob?.timezone ?? school.timezone,
    },
  });
  const utils = api.useUtils();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: z.infer<typeof addStaffScheduleSchema>) => {
    setIsLoading(true);
    const userId = staffs.find((staff) => staff.id === data.staffId)?.userId;
    if (!userId) {
      toast.error("Staff is not link to a user");
      return;
    }
    const values = {
      userId: userId,
      cron: data.cron,
      type: "transaction-summary",
      timezone: data.timezone,
    };

    void fetch("/api/trigger/schedules", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then(() => {
        toast.success(t("schedule_created_successfully"));
        void utils.scheduleJob.invalidate();
        closeModal();
      })
      .catch((e) => {
        toast.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          name="timezone"
          render={({ field }) => (
            <FormItem className="space-y-0">
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
                    {timezones.map((timezone, index) => {
                      return (
                        <SelectItem
                          key={`${timezone}-${index}`}
                          value={timezone}
                        >
                          {timezone}
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
            variant={"secondary"}
            onClick={() => {
              closeModal();
            }}
          >
            <XIcon className="mr-2 h-4 w-4" />
            {t("cancel")}
          </Button>
          <Button isLoading={isLoading} type="submit">
            <SaveIcon className="mr-2 h-4 w-4" />
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
