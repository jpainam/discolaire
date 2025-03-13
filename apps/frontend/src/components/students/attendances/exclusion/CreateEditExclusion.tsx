"use client";

import { useParams } from "next/navigation";
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
  useForm,
} from "@repo/ui/components/form";
import { Textarea } from "@repo/ui/components/textarea";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useRouter } from "~/hooks/use-router";

import { DatePicker } from "~/components/shared/date-picker";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { api } from "~/trpc/react";

const schema = z.object({
  termId: z.string().min(1),
  startDate: z.coerce.date().default(() => new Date()),
  endDate: z.coerce.date(),
  reason: z.string().min(1),
});
export function CreateEditExclusion({
  exclusion,
}: {
  exclusion?: RouterOutputs["exclusion"]["all"][number];
}) {
  const form = useForm({
    schema: schema,
    defaultValues: {
      startDate: exclusion?.startDate ?? new Date(),
    },
  });
  const utils = api.useUtils();
  const router = useRouter();
  const createExclusionMutation = api.exclusion.create.useMutation({
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
  const updateExclusionMutation = api.exclusion.update.useMutation({
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
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      termId: parseInt(data.termId),
    };
    if (exclusion) {
      toast.loading(t("updating"), { id: 0 });
      updateExclusionMutation.mutate({ ...values, id: exclusion.id });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createExclusionMutation.mutate(values);
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
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("from")}</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("to")}</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("reason")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
              createExclusionMutation.isPending ||
              updateExclusionMutation.isPending
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
