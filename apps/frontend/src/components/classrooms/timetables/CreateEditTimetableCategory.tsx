"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

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

const createTimetableCategorySchema = z.object({
  name: z.string().min(1),
});
export function CreateEditTimetableCategory({
  id,
  name,
}: {
  id?: string;
  name?: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createTimetableCategorySchema),
    defaultValues: {
      name: name ?? "",
    },
  });
  const { closeModal } = useModal();
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation(
    trpc.timetableCategory.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.timetableCategory.all.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateCategoryMutation = useMutation(
    trpc.timetableCategory.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.timetableCategory.all.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof createTimetableCategorySchema>) => {
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateCategoryMutation.mutate({
        id: id,
        name: data.name,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createCategoryMutation.mutate({ name: data.name });
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
              <FormLabel>{t("category")}</FormLabel>
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
              createCategoryMutation.isPending ||
              updateCategoryMutation.isPending
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
