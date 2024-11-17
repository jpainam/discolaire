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
import { Input } from "@repo/ui/input";

import { api } from "~/trpc/react";

const createEditAppreciationSchema = z.object({
  min: z.coerce.number().min(0),
  max: z.coerce.number().min(0),
  appreciation: z.string().min(1),
});
export function CreateEditGradeAppreciation({
  gradeAppreciation,
}: {
  gradeAppreciation?: RouterOutputs["gradeAppreciation"]["all"][number];
}) {
  const form = useForm({
    schema: createEditAppreciationSchema,
    defaultValues: {
      min: gradeAppreciation?.minGrade ?? 0,
      max: gradeAppreciation?.maxGrade ?? 0,
      appreciation: gradeAppreciation?.appreciation ?? "",
    },
  });
  const { t } = useLocale();
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const createAppreciation = api.gradeAppreciation.create.useMutation({
    onSettled: () => {
      void utils.gradeAppreciation.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      closeModal();
      toast.success(t("created_successfully"), { id: 0 });
    },
  });
  const updateAppreciation = api.gradeAppreciation.update.useMutation({
    onSettled: () => {
      void utils.gradeAppreciation.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      closeModal();
      toast.success(t("updated_successfully"), { id: 0 });
    },
  });

  const handleSubmit = (data: z.infer<typeof createEditAppreciationSchema>) => {
    const values = {
      minGrade: data.min,
      maxGrade: data.max,
      appreciation: data.appreciation,
    };
    if (gradeAppreciation) {
      toast.loading(t("updating"), { id: 0 });
      updateAppreciation.mutate({
        id: gradeAppreciation.id,
        ...values,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createAppreciation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="gap4 grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="min"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("min_grade")}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("max_grade")}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="appreciation"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("appreciation")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center justify-end gap-4">
          <Button
            type="button"
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              closeModal();
            }}
          >
            <XIcon className="mr-2 size-4" />
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createAppreciation.isPending || updateAppreciation.isPending
            }
            type="submit"
            size={"sm"}
          >
            <SaveIcon className="mr-2 size-4" />
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
