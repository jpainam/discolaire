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
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
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
    resolver: standardSchemaResolver(createLevelSchema),
    defaultValues: {
      name: name ?? "",
      order: order ? `${order}` : "0",
    },
  });

  const t = useTranslations();
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
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={
              updateClassroomLevel.isPending || createClassroomLevel.isPending
            }
            type="submit"
          >
            {(updateClassroomLevel.isPending ||
              createClassroomLevel.isPending) && <Spinner />}
            {id ? t("edit") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
