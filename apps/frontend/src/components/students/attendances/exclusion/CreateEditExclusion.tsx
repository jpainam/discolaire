"use client";

import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

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
import { Textarea } from "@repo/ui/components/textarea";

import { DatePicker } from "~/components/DatePicker";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  startDate: z.coerce.date().default(() => new Date()),
  endDate: z.coerce.date(),
  reason: z.string().min(1),
});
export function CreateEditExclusion({
  exclusion,
  termId,
}: {
  exclusion?: RouterOutputs["exclusion"]["all"][number];
  termId: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: exclusion?.startDate ?? new Date(),
      endDate: exclusion?.endDate ?? new Date(),
      reason: exclusion?.reason ?? "",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createExclusionMutation = useMutation(
    trpc.exclusion.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.exclusion.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateExclusionMutation = useMutation(
    trpc.exclusion.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.exclusion.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const { closeModal } = useModal();

  const handleSubmit = (data: z.infer<typeof schema>) => {
    const values = {
      studentId: params.id,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      termId: termId,
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
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("from")}</FormLabel>
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
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("to")}</FormLabel>
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
        </div>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reason")}</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
            size={"sm"}
            type={"button"}
          >
            {t("close")}
          </Button>
          <Button
            isLoading={
              createExclusionMutation.isPending ||
              updateExclusionMutation.isPending
            }
            size={"sm"}
            type={"submit"}
          >
            {exclusion ? t("edit") : t("add")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
