"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const createStaffLevelSchema = z.object({
  name: z.string().min(1),
});
export function CreateEditStaffLevel({
  id,
  name,
}: {
  id?: string;
  name?: string;
}) {
  const form = useForm({
    resolver: zodResolver(createStaffLevelSchema),
    defaultValues: {
      name: name ?? "",
    },
  });
  const { closeModal } = useModal();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { t } = useLocale();

  const createStaffLevelMutation = useMutation(
    trpc.degree.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.degree.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateStaffLevelMutation = useMutation(
    trpc.degree.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.degree.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof createStaffLevelSchema>) => {
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateStaffLevelMutation.mutate({
        id: id,
        name: data.name,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createStaffLevelMutation.mutate({ name: data.name });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="my-2 flex flex-row items-center justify-end gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
            type="button"
            size={"sm"}
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            isLoading={
              createStaffLevelMutation.isPending ||
              updateStaffLevelMutation.isPending
            }
            variant={"default"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
