"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
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
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";

import { UserSelector } from "~/components/shared/selects/UserSelector";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { ConsumableSelector } from "../ConsumableSelector";

const schema = z.object({
  userId: z.string().min(1),
  quantity: z.coerce.number().min(1).max(1000),
  note: z.string().optional(),
  consumableId: z.string().min(1),
});

export function CreateEditStockWithdrawal({
  id,
  userId,
  consumableId,
  quantity,
  note,
}: {
  id?: string;
  userId?: string;
  consumableId?: string;
  quantity?: number;
  note?: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: userId ?? "",
      quantity: quantity ?? 1,
      consumableId: consumableId ?? "",
      note: note ?? "",
    },
  });

  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const createConsumableMutation = useMutation(
    trpc.inventory.createConsumableUsage.mutationOptions({
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
  const { t } = useLocale();
  const handleSubmit = (data: z.infer<typeof schema>) => {
    toast.loading(t("Processing"), { id: 0 });
    const values = {
      consumableId: data.consumableId,
      userId: data.userId,
      quantity: data.quantity,
      note: data.note,
    };
    if (id) {
      //
    } else {
      createConsumableMutation.mutate(values);
    }
  };

  const { closeSheet } = useSheet();
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col gap-6 px-4">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("user")}</FormLabel>
                <FormControl>
                  <UserSelector
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
            name="consumableId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consumable")}</FormLabel>
                <FormControl>
                  <ConsumableSelector
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
            <Button isLoading={createConsumableMutation.isPending} size={"sm"}>
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
