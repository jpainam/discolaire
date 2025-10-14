"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";
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

import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  name: z.string().min(5),
  sku: z.string().optional(),
  serial: z.string().optional(),
  note: z.string().optional(),
});
export function CreateEditAsset({
  asset,
}: {
  asset?: RouterOutputs["inventory"]["assets"][number];
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: asset?.name ?? "",
      sku: asset?.sku ?? "",
      serial: asset?.serial ?? "",
      note: asset?.note?.replace(/,/g, "\n") ?? "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createAssetMutation = useMutation(
    trpc.inventory.createAsset.mutationOptions({
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
  const updateAssetMutation = useMutation(
    trpc.inventory.updateAsset.mutationOptions({
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
  const { closeModal } = useModal();
  const handleSubmit = (data: z.infer<typeof schema>) => {
    const values = {
      name: data.name,
      sku: data.sku,
      serial: data.serial,
      note: data.note,
    };
    toast.loading(t("Processing"), { id: 0 });
    if (asset) {
      updateAssetMutation.mutate({
        ...values,
        id: asset.id,
      });
    } else {
      createAssetMutation.mutate(values);
    }
  };
  const { t } = useLocale();
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
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Sku")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Serial number")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Serial number")}</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            variant={"outline"}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createAssetMutation.isPending || updateAssetMutation.isPending
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
