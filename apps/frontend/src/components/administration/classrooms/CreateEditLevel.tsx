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
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTRPC } from "~/trpc/react";

const createLevelSchema = z.object({
  name: z.string().min(1),
  order: z.string().min(1).default("0"),
});
export function CreateEditLevel({
  name,
  order,
  id,
}: {
  name?: string;
  id?: string;
  order?: number;
}) {
  const form = useForm({
    resolver: zodResolver(createLevelSchema),
    defaultValues: {
      name: name ?? "",
      order: order ? `${order}` : "0",
    },
  });
  const { t } = useLocale();
  const { closeModal } = useModal();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createClassroomLevel = useMutation(
    trpc.classroomLevel.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroomLevel.all.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const updateClassroomLevel = useMutation(
    trpc.classroomLevel.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroomLevel.all.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof createLevelSchema>) => {
    const values = {
      name: data.name,
      order: Number(data.order),
    };
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateClassroomLevel.mutate({ id: id, ...values });
    } else {
      createClassroomLevel.mutate(values);
      toast.loading(t("creating"), { id: 0 });
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
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
                <Input {...field} placeholder="Order" />
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
          <Button
            isLoading={
              updateClassroomLevel.isPending || createClassroomLevel.isPending
            }
            size={"sm"}
            type="submit"
          >
            {id ? t("edit") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
