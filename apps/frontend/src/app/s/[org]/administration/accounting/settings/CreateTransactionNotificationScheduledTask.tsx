"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaveIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
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
    resolver: zodResolver(addStaffScheduleSchema),
    defaultValues: {
      cron: scheduleTask?.cron ?? "0 18 * * *",
      staffId: staffId ?? "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createScheduleTask = useMutation(
    trpc.scheduleTask.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.scheduleTask.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const updateScheduleTask = useMutation(
    trpc.scheduleTask.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.scheduleTask.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

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
      <form className="grid gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("staff")}</FormLabel>
              <FormControl>
                <StaffSelector
                  defaultValue={field.value}
                  onSelect={(val) => field.onChange(val)}
                />
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
                  <SelectTrigger className="w-full">
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
            <XIcon />
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createScheduleTask.isPending || updateScheduleTask.isPending
            }
            type="submit"
          >
            <SaveIcon />
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
