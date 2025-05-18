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
import { Textarea } from "@repo/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserSelector } from "~/components/shared/selects/UserSelector";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { InventorySelector } from "./InventorySelector";
const schema = z.object({
  userId: z.string().min(1),
  consumableId: z.string().min(1),
  quantity: z.coerce.number().min(1).max(1000),
  note: z.string().optional(),
  //type: z.enum(["IN", "OUT"]).default("OUT"),
});

export function CreateEditConsumableUsage({
  userId,
  consumableId,
  quantity,
  note,
}: {
  userId?: string;
  consumableId?: string;
  quantity?: number;
  note?: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      iteconsumableIdmId: consumableId ?? "",
      userId: userId ?? "",
      quantity: quantity ?? 1,
      note: note ?? "",
      //type: type,
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createConsumableMutation = useMutation(
    trpc.inventory.createConsumableUsage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        closeSheet();
      },
    })
  );
  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };
  const { t } = useLocale();
  const { closeSheet } = useSheet();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="px-4 flex flex-col gap-6">
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("item")}</FormLabel>
                <FormControl>
                  <InventorySelector
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
          {type == "OUT" && (
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
          )}

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
            <Button isLoading={createMovementMutation.isPending} size={"sm"}>
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
