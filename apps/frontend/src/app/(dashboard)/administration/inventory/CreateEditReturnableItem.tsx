"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

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

const schema = z.object({
  name: z.string().min(5),
  sku: z.string().optional(),
  serial: z.string().optional(),
  note: z.string().optional(),
});

type AssetItem = Extract<
  RouterOutputs["inventory"]["all"][number],
  { type: "ASSET" }
>;

export function CreateEditReturnableItem({
  asset,
}: {
  asset?: AssetItem;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: asset?.name ?? "",
      sku: asset?.other.sku ?? "",
      serial: asset?.other.serial ?? "",
      note: asset?.note?.replace(/,/g, "\n") ?? "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createAssetMutation = useMutation(
    trpc.inventory.createItem.mutationOptions({
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
    trpc.inventory.updateItem.mutationOptions({
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
      trackingType: "RETURNABLE" as const,
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

  const t = useTranslations();
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
              <FormLabel>{t("note")}</FormLabel>
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
            variant={"outline"}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={
              createAssetMutation.isPending || updateAssetMutation.isPending
            }
            type="submit"
          >
            {(createAssetMutation.isPending ||
              updateAssetMutation.isPending) && <Spinner />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
