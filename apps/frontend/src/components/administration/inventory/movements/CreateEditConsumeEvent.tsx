"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { StaffSelector } from "~/components/shared/selects/StaffSelector";
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
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { InventoryItemSelector } from "../InventoryItemSelector";

const schema = z.object({
  staffId: z.string().min(1),
  quantity: z.coerce.number().min(1).max(1000),
  note: z.string().optional(),
  consumableId: z.string().min(1),
});

export function CreateEditConsumeEvent({
  id,
  staffId,
  consumableId,
  quantity,
  note,
}: {
  id?: string;
  staffId?: string;
  consumableId?: string;
  quantity?: number;
  note?: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      staffId: staffId ?? "",
      quantity: quantity ?? 1,
      consumableId: consumableId ?? "",
      note: note ?? "",
    },
  });

  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const createConsumableMutation = useMutation(
    trpc.inventory.createEvent.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateConsumableMutation = useMutation(
    trpc.inventory.updateEvent.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const t = useTranslations();
  const handleSubmit = (data: z.infer<typeof schema>) => {
    toast.loading(t("Processing"), { id: 0 });
    const values = {
      itemId: data.consumableId,
      assigneeId: data.staffId,
      type: "CONSUME" as const,
      quantity: data.quantity,
      note: data.note,
    };
    if (id) {
      updateConsumableMutation.mutate({
        id,
        ...values,
      });
    } else {
      createConsumableMutation.mutate(values);
    }
  };

  const { closeModal } = useModal();
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("staff")}</FormLabel>
              <FormControl>
                <StaffSelector
                  defaultValue={field.value}
                  onSelect={(value) => {
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
          name="consumableId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("consumable")}</FormLabel>
              <FormControl>
                <InventoryItemSelector
                  onChange={field.onChange}
                  defaultValue={field.value}
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
                <Input
                  type="number"
                  value={
                    typeof field.value === "number" ||
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  onChange={(event) => field.onChange(event.target.value)}
                />
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
        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={
              createConsumableMutation.isPending ||
              updateConsumableMutation.isPending
            }
          >
            {(createConsumableMutation.isPending ||
              updateConsumableMutation.isPending) && <Spinner />}
            {t("submit")}
          </Button>
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            variant={"outline"}
          >
            {t("close")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
