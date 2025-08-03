"use client";

import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";



import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";



import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";


const schema = z.object({
  date: z.coerce.date().default(() => new Date()),
  duration: z.string().min(1),
  justify: z.coerce.number().optional(),
  reason: z.string().optional(),
});
export function CreateEditLateness({
  lateness,
  termId,
}: {
  lateness?: RouterOutputs["lateness"]["all"][number];
  termId: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: lateness?.date ?? new Date(),
      duration: lateness?.duration ?? "",
      justify: 0,
      reason: lateness?.reason ?? "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createLatenessMutation = useMutation(
    trpc.lateness.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        await queryClient.invalidateQueries(trpc.lateness.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateLatenessMutation = useMutation(
    trpc.lateness.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.lateness.all.pathFilter());
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
      duration: data.duration,
      termId: termId,
      date: data.date,
      reason: data.reason,
      justify: data.justify,
    };
    if (lateness) {
      toast.loading(t("updating"), { id: 0 });
      updateLatenessMutation.mutate({ ...values, id: lateness.id });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createLatenessMutation.mutate(values);
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
                <Input
                  type="datetime-local"
                  onChange={(e) => {
                    const newDate = e.target.value
                      ? new Date(e.target.value)
                      : null;

                    field.onChange(newDate);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("duration")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                nombre de retards ou format heure:minute (ex: 00:30)
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center justify-end gap-4">
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
              createLatenessMutation.isPending ||
              updateLatenessMutation.isPending
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