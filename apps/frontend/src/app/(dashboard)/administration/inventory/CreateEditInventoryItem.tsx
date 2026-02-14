"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

const schema = z
  .object({
    name: z.string().min(2),
    trackingType: z.enum(["CONSUMABLE", "RETURNABLE"]),
    unitId: z.string().optional(),
    minStockLevel: z.coerce.number().min(0).optional(),
    sku: z.string().optional(),
    serial: z.string().optional(),
    note: z.string().optional(),
    defaultReturnDate: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.trackingType === "CONSUMABLE" && !value.unitId) {
      ctx.addIssue({
        code: "custom",
        message: "Unit is required",
        path: ["unitId"],
      });
    }
  });

export function CreateEditInventoryItem({
  item,
}: {
  item?: Pick<
    RouterOutputs["inventory"]["all"][number],
    "id" | "name" | "note" | "type" | "other"
  >;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeSheet } = useSheet();

  const defaultTrackingType = item?.type === "ASSET" ? "RETURNABLE" : "CONSUMABLE";

  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: item?.name ?? "",
      trackingType: defaultTrackingType,
      unitId: item?.other.unitId ?? "",
      minStockLevel: item?.other.minStockLevel
        ? Number(item.other.minStockLevel)
        : 0,
      sku: item?.other.sku ?? "",
      serial: item?.other.serial ?? "",
      note: item?.note?.replace(/,/g, "\n") ?? "",
      defaultReturnDate: item?.other.defaultReturnDate
        ? item.other.defaultReturnDate.slice(0, 10)
        : "",
    },
  });

  const trackingType = form.watch("trackingType");

  const unitsQuery = useQuery(trpc.inventory.units.queryOptions());

  const createItemMutation = useMutation(
    trpc.inventory.createItem.mutationOptions({
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

  const updateItemMutation = useMutation(
    trpc.inventory.updateItem.mutationOptions({
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

  const handleSubmit = (values: z.infer<typeof schema>) => {
    toast.loading(t("Processing"), { id: 0 });

    const payload = {
      name: values.name,
      trackingType: values.trackingType,
      unitId: values.trackingType === "CONSUMABLE" ? values.unitId : undefined,
      minStockLevel:
        values.trackingType === "CONSUMABLE"
          ? Number(values.minStockLevel ?? 0)
          : undefined,
      sku: values.trackingType === "RETURNABLE" ? values.sku : undefined,
      serial: values.trackingType === "RETURNABLE" ? values.serial : undefined,
      defaultReturnDate:
        values.trackingType === "RETURNABLE" ? values.defaultReturnDate : undefined,
      note: values.note,
    };

    if (item) {
      updateItemMutation.mutate({
        id: item.id,
        ...payload,
      });
      return;
    }

    createItemMutation.mutate(payload);
  };

  const isPending = createItemMutation.isPending || updateItemMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 px-4">
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

        <FormField
          control={form.control}
          name="trackingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Tracking type"}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSUMABLE">{"One-time usage"}</SelectItem>
                    <SelectItem value="RETURNABLE">{"Returnable"}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {trackingType === "CONSUMABLE" && (
          <>
            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Unit")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Unit")} />
                      </SelectTrigger>
                      <SelectContent>
                        {unitsQuery.data?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minStockLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Min level stock")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
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
          </>
        )}

        {trackingType === "RETURNABLE" && (
          <>
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

            <FormField
              control={form.control}
              name="defaultReturnDate"
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
          </>
        )}

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

        <div className="ml-auto flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => closeSheet()}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
