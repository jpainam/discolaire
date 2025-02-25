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
  useForm,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";

const createEditRoleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});
export function CreateEditRole({
  id,
  name,
  description,
}: {
  id?: string;
  name?: string;
  description?: string;
}) {
  const form = useForm({
    schema: createEditRoleSchema,
    defaultValues: {
      name: name ?? "",
      description: description ?? "",
    },
  });
  const { closeModal } = useModal();
  const { t } = useLocale();
  const utils = api.useUtils();
  const createRoleMutation = api.role.create.useMutation({
    onSettled: () => utils.role.invalidate(),
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const updateRoleMutation = api.role.update.useMutation({
    onSettled: () => utils.role.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof createEditRoleSchema>) => {
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateRoleMutation.mutate({
        ...data,
        id,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createRoleMutation.mutate(data);
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
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Input placeholder={t("description")} {...field} />
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
            variant={"outline"}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createRoleMutation.isPending || updateRoleMutation.isPending
            }
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
