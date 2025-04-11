"use client";

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
import { Switch } from "@repo/ui/components/switch";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { DatePicker } from "~/components/DatePicker";
import { useTRPC } from "~/trpc/react";

type Term = RouterOutputs["term"]["all"][number];

const createEditTermSchema = z.object({
  name: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean(),
});
export function CreateEditTerm({ term }: { term?: Term }) {
  const form = useForm({
    resolver: zodResolver(createEditTermSchema),
    defaultValues: {
      name: term?.name ?? "",
      startDate: term?.startDate ?? new Date(),
      endDate: term?.endDate ?? new Date(),
      isActive: term?.isActive ?? true,
    },
  });
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { closeModal } = useModal();
  const createTermMutation = useMutation(
    trpc.term.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.term.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const updateTermMutation = useMutation(
    trpc.term.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.term.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const { t } = useLocale();
  const onSubmit = (data: z.infer<typeof createEditTermSchema>) => {
    if (term) {
      toast.loading(t("updating"), { id: 0 });
      updateTermMutation.mutate({ id: term.id, ...data });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createTermMutation.mutate(data);
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel htmlFor="name">{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel htmlFor="startDate">{t("start_date")}</FormLabel>
              <FormControl>
                <DatePicker
                  defaultValue={field.value}
                  onChange={(e) => field.onChange(e)}
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
            <FormItem className="col-span-3">
              <FormLabel htmlFor="endDate">{t("end_date")}</FormLabel>
              <FormControl>
                <DatePicker
                  defaultValue={field.value}
                  onChange={(e) => field.onChange(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4 space-y-0">
              <FormLabel htmlFor="isActive">{t("active")}</FormLabel>
              <FormControl>
                <Switch
                  id="isActive"
                  name="isActive"
                  onCheckedChange={field.onChange}
                  defaultChecked={form.getValues("isActive")}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            size={"sm"}
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              updateTermMutation.isPending || createTermMutation.isPending
            }
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
