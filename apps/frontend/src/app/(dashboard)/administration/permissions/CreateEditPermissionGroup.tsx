"use client";

import type { RouterOutputs } from "@repo/api";
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
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";
const permissionSchema = z.object({
  name: z.string().min(1),
});
export function CreateEditPermissionGroup({
  permissionGroup,
}: {
  permissionGroup?: RouterOutputs["permission"]["groups"][number];
}) {
  const { closeModal } = useModal();
  const form = useForm({
    schema: permissionSchema,
    defaultValues: {
      name: permissionGroup?.name ?? "",
    },
  });
  const utils = api.useUtils();
  const updatePermission = api.permission.updateGroup.useMutation({
    onSettled: async () => {
      await utils.permission.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const createPermission = api.permission.createGroup.useMutation({
    onSettled: async () => {
      await utils.permission.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const { t } = useLocale();
  const handleSubmit = (data: z.infer<typeof permissionSchema>) => {
    if (permissionGroup) {
      toast.loading(t("updating"), { id: 0 });
      void updatePermission.mutate({
        id: permissionGroup.id,
        name: data.name,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      void createPermission.mutate({
        name: data.name,
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex ml-auto flex-row gap-2 items-center">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => {
              closeModal();
            }}
            className="w-fit"
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={updatePermission.isPending || createPermission.isPending}
            type="submit"
            className="w-fit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
