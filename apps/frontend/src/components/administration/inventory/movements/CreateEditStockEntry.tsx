"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ConsumableSelector } from "~/components/administration/inventory/ConsumableSelector";
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
import { Textarea } from "~/components/ui/textarea";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  consumableId: z.string().min(1),
  quantity: z.coerce.number().min(1).max(1000),
  note: z.string().optional(),
});
export function CreateEditStockEntry({
  id,
  quantity,
  note,
  consumableId,
}: {
  consumableId?: string;
  id?: string;
  quantity?: number;
  note?: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      consumableId: consumableId ?? "",
      quantity: quantity ?? 1,
      note: note ?? "",
    },
  });

  const trpc = useTRPC();

  const t = useTranslations();
  const queryClient = useQueryClient();
  const createMovementMutation = useMutation(
    trpc.inventory.createStockMovement.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateMovementMutation = useMutation(
    trpc.inventory.updateStockMovement.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const handleSubmit = (data: z.infer<typeof schema>) => {
    toast.loading(t("loading"), { id: 0 });
    const values = {
      consumableId: data.consumableId,
      quantity: data.quantity,
      type: "IN" as const,
      note: data.note,
    };
    if (id) {
      updateMovementMutation.mutate({ ...values, id });
    } else {
      createMovementMutation.mutate(values);
    }
  };

  const { closeSheet } = useSheet();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-6 px-4">
          <FormField
            control={form.control}
            name="consumableId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consumable")}</FormLabel>
                <FormControl>
                  <ConsumableSelector
                    defaultValue={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("quantity")}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("observation")}</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-2">
            <Button
              isLoading={
                createMovementMutation.isPending ||
                updateMovementMutation.isPending
              }
              size={"sm"}
            >
              {t("submit")}
            </Button>
            <Button
              onClick={() => {
                closeSheet();
              }}
              type="button"
              size={"sm"}
              variant={"outline"}
            >
              {t("close")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
