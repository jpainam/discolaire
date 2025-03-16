"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "~/hooks/use-router";

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
import { Input } from "@repo/ui/components/input";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { DatePicker } from "~/components/DatePicker";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { api } from "~/trpc/react";

const schema = z.object({
  termId: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
  value: z.coerce.number().default(1),
});
export function CreateEditChatter({
  chatter,
}: {
  chatter?: RouterOutputs["chatter"]["all"][number];
}) {
  const form = useForm({
    schema: schema,
    defaultValues: {
      date: chatter?.date ?? new Date(),
      value: chatter?.value ?? 1,
    },
  });
  const utils = api.useUtils();
  const router = useRouter();
  const createChatterMutation = api.chatter.create.useMutation({
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
  const updateChatterMutation = api.chatter.update.useMutation({
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
      value: data.value,
      termId: parseInt(data.termId),
    };
    if (chatter) {
      toast.loading(t("updating"), { id: 0 });
      updateChatterMutation.mutate({ ...values, id: chatter.id });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createChatterMutation.mutate(values);
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
                <DatePicker
                  defaultValue={field.value}
                  onChange={(val) => field.onChange(val)}
                />
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
                <Input
                  type="number"
                  placeholder={t("number_of_chatter")}
                  {...field}
                  defaultValue={chatter?.value.toString()}
                />
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
              createChatterMutation.isPending || updateChatterMutation.isPending
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
