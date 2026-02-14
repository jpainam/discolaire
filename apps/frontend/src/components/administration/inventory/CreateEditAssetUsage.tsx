"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { UserSelector } from "~/components/shared/selects/UserSelector";
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
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  note: z.string().optional(),
  userId: z.string().min(1),
  location: z.string().optional(),
  dueAt: z.string().optional(),
});

export function CreateEditAssetUsage({
  id,
  note,
  userId,
  assetId,
  location,
  dueAt,
}: {
  note?: string;
  assetId: string;
  id?: string;
  location?: string;
  userId?: string;
  dueAt?: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      note: note ?? "",
      userId: userId ?? "",
      location: location ?? "",
      dueAt: dueAt ?? "",
    },
  });

  const t = useTranslations();
  const { closeSheet } = useSheet();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createAssetUsageMutation = useMutation(
    trpc.inventory.createAssetUsage.mutationOptions({
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
  const updateAssetUsageMutation = useMutation(
    trpc.inventory.updateAssetUsage.mutationOptions({
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
    toast.loading(t("Processing"), { id: 0 });
    const values = {
      note: data.note,
      userId: data.userId,
      assetId: assetId,
      location: data.location,
      dueAt: data.dueAt,
    };
    if (!id) {
      createAssetUsageMutation.mutate(values);
    } else {
      updateAssetUsageMutation.mutate({
        ...values,
        id: id,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-1 gap-4 px-4"
      >
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("user")}</FormLabel>
              <FormControl>
                <UserSelector
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Location")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Expected return date"}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
            disabled={
              createAssetUsageMutation.isPending ||
              updateAssetUsageMutation.isPending
            }
          >
            {(createAssetUsageMutation.isPending ||
              updateAssetUsageMutation.isPending) && <Spinner />}
            {t("submit")}
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeSheet();
            }}
            type="button"
          >
            {t("close")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
