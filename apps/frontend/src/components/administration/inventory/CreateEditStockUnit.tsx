"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
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
    resolver: zodResolver(schema),
    defaultValues: {
      name: name ?? "",
    },
  });
  const handleSubmit = (data: z.infer<typeof schema>) => {
    toast.loading("Processing...", { id: 0 });
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
  const { t } = useLocale();
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
        <div className="flex flex-row justify-end items-center gap-2">
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
