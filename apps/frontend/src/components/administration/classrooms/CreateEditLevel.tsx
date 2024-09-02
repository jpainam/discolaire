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
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const createLevelSchema = z.object({
  name: z.string().min(1),
  order: z.coerce.number().int().min(0),
});
export function CreateEditLevel({
  name,
  order,
  id,
}: {
  name?: string;
  id?: number;
  order?: number;
}) {
  const form = useForm({
    schema: createLevelSchema,
    defaultValues: {
      name: name ?? "",
      order: order ?? 0,
    },
  });
  const { t } = useLocale();
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const createClassroomLevel = api.classroomLevel.create.useMutation({
    onSettled: () => utils.classroomLevel.invalidate(),
  });
  const updateClassroomLevel = api.classroomLevel.update.useMutation({
    onSettled: () => utils.classroomLevel.invalidate(),
  });

  const onSubmit = (data: z.infer<typeof createLevelSchema>) => {
    const values = {
      name: data.name,
      group: data.order,
    };
    if (id) {
      updateClassroomLevel.mutate({ id: id, ...values });
    } else {
      toast.promise(createClassroomLevel.mutateAsync(values), {
        success: () => {
          closeModal();
          return t("created_successfully");
        },
        loading: t("creating"),
        error: (error) => {
          return getErrorMessage(error);
        },
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
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="order"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("order")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Order" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="ml-auto flex gap-4">
          <Button
            type="button"
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
          >
            {t("cancel")}
          </Button>
          <Button size={"sm"} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
