"use client";

import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@repo/ui/components/input";

import { DatePicker } from "~/components/DatePicker";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  date: z.coerce.date().default(() => new Date()),
  value: z.coerce.number().default(1),
});
export function CreateEditChatter({
  chatter,
  termId,
}: {
  chatter?: RouterOutputs["chatter"]["all"][number];
  termId: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: chatter?.date ?? new Date(),
      value: chatter?.value ?? 1,
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createChatterMutation = useMutation(
    trpc.chatter.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.chatter.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateChatterMutation = useMutation(
    trpc.chatter.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.chatter.all.pathFilter());
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
      value: data.value,
      termId: termId,
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
              createChatterMutation.isPending || updateChatterMutation.isPending
            }
            size={"sm"}
            type={"submit"}
          >
            {t("add")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
