"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const createAssignmentCategorySchema = z.object({
  name: z.string().min(1),
});
export function CreateEditAssignmentCategory({
  id,
  name,
}: {
  id?: string;
  name?: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createAssignmentCategorySchema),
    defaultValues: {
      name: name ?? "",
    },
  });
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const t = useTranslations();
  const createAssignmentCategoryMutation = useMutation(
    trpc.assignment.createCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.assignment.categories.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const { closeModal } = useModal();

  const updateAssignmentCategoryMutation = useMutation(
    trpc.assignment.updateCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.assignment.categories.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof createAssignmentCategorySchema>) => {
    if (id) {
      toast.success(t("updating"), { id: 0 });
      updateAssignmentCategoryMutation.mutate({
        id: id,
        name: data.name,
      });
    } else {
      toast.success(t("creating"), { id: 0 });
      createAssignmentCategoryMutation.mutate({
        name: data.name,
      });
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
              <FormLabel></FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex flex-row items-center justify-end gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
            size={"sm"}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createAssignmentCategoryMutation.isPending ||
              updateAssignmentCategoryMutation.isPending
            }
            variant={"default"}
            size={"sm"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
