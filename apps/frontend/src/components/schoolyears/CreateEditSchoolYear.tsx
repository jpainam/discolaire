"use client";

import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
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

import { api } from "~/trpc/react";
import { DatePicker } from "../shared/date-picker";

const schoolYearSchema = z.object({
  name: z.string().min(1),
  start: z.coerce.date(),
  end: z.coerce.date(),
  isActive: z.boolean().default(true),
});
interface CreateEditSchoolYearProps {
  id?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}
export function CreateEditSchoolYear({
  name,
  id,
  startDate,
  endDate,
  isActive,
}: CreateEditSchoolYearProps) {
  const { t } = useLocale();
  const form = useForm({
    schema: schoolYearSchema,
    defaultValues: {
      start: startDate ?? new Date(),
      end: endDate ?? new Date(),
      name: name ?? "",
      isActive: isActive ?? true,
    },
  });
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const updateSchoolYearMutation = api.schoolYear.update.useMutation({
    onSettled: () => utils.schoolYear.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const createSchoolYearMutation = api.schoolYear.create.useMutation({
    onSettled: () => utils.schoolYear.invalidate(),
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof schoolYearSchema>) => {
    const values = {
      startDate: data.start,
      endDate: data.end,
      name: data.name,
      isActive: !data.isActive,
    };
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateSchoolYearMutation.mutate({ id, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createSchoolYearMutation.mutate(values);
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="start"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("start_date")}</FormLabel>
              <FormControl>
                <DatePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="end"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("end_date")}</FormLabel>
              <FormControl>
                <DatePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mt-4 flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  defaultChecked={!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel>{t("lock")}</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto mt-4 flex flex-row gap-4">
          <Button
            type="button"
            variant={"outline"}
            size="sm"
            onClick={() => {
              closeModal();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={createSchoolYearMutation.isPending}
            variant={"default"}
            size={"sm"}
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
