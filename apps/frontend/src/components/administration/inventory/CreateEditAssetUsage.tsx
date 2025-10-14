"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

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

const schema = z.object({
  note: z.string().optional(),
  userId: z.string().min(1),
  location: z.string().optional(),
});

export function CreateEditAssetUsage({
  id,
  note,
  userId,
  assetId,
  location,
}: {
  note?: string;
  assetId: string;
  id?: string;
  location?: string;
  userId?: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      note: note ?? "",
      userId: userId ?? "",
      location: location ?? "",
    },
  });
  const { t } = useLocale();
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
    toast.loading(t("loading"), { id: 0 });
    const values = {
      note: data.note,
      userId: data.userId,
      assetId: assetId,
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
          <Button isLoading={createAssetUsageMutation.isPending} size={"sm"}>
            {t("submit")}
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeSheet();
            }}
            type="button"
            size={"sm"}
          >
            {t("close")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
