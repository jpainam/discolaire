"use client";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTRPC } from "~/trpc/react";

const createRelationshipSchema = z.object({
  name: z.string().min(1),
});
export function CreateEditRelationship({
  id,
  name,
}: {
  id?: number;
  name?: string;
}) {
  const form = useForm({
    resolver: zodResolver(createRelationshipSchema),
    defaultValues: {
      name: name ?? "",
    },
  });
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { t } = useLocale();

  const createRelationshipMutation = useMutation(
    trpc.studentContact.createRelationship.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studentContact.relationships.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateRelationshipMutation = useMutation(
    trpc.studentContact.updateRelationship.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studentContact.relationships.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof createRelationshipSchema>) => {
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateRelationshipMutation.mutate({
        id: id,
        name: data.name,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createRelationshipMutation.mutate({ name: data.name });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-end gap-4">
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
              createRelationshipMutation.isPending ||
              updateRelationshipMutation.isPending
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
