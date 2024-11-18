"use client";

import { toast } from "sonner";
import { z } from "zod";

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
    schema: createRelationshipSchema,
    defaultValues: {
      name: name ?? "",
    },
  });
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const { t } = useLocale();

  const createRelationshipMutation =
    api.studentContact.createRelationship.useMutation({
      onSettled: () => utils.studentContact.relationships.invalidate(),
      onSuccess: () => {
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    });

  const updateRelationshipMutation =
    api.studentContact.updateRelationship.useMutation({
      onSettled: () => utils.studentContact.relationships.invalidate(),
      onSuccess: () => {
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    });
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
