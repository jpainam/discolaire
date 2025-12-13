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

const schema = z.object({
  name: z.string().min(5),
});
export function CreateEditStockUnit({
  id,
  name,
}: {
  id?: string;
  name?: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: name ?? "",
    },
  });
  const handleSubmit = (data: z.infer<typeof schema>) => {
    toast.loading("Processing", { id: 0 });
    if (id) {
      updateStockUnitMutation.mutate({
        id: id,
        name: data.name,
      });
    } else {
      createStockUnitMutation.mutate({
        name: data.name,
      });
    }
  };
  const { closeModal } = useModal();

  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createStockUnitMutation = useMutation(
    trpc.inventory.createUnit.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("Success"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateStockUnitMutation = useMutation(
    trpc.inventory.updateUnit.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("Success"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
            size={"sm"}
          >
            {t("close")}
          </Button>
          <Button
            isLoading={
              createStockUnitMutation.isPending ||
              updateStockUnitMutation.isPending
            }
            size={"sm"}
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
