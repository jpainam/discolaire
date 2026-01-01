"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { CreateEditStockUnit } from "~/components/administration/inventory/CreateEditStockUnit";
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
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  name: z.string().min(5),
  minStockLevel: z.number().default(0),
  unitId: z.string().min(1),
  note: z.string().optional(),
});
export function CreateEditConsumable({
  consumable,
}: {
  consumable?: RouterOutputs["inventory"]["consumables"][number];
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: consumable?.name ?? "",
      //currentStock: consumable?.currentStock ?? 0,
      minStockLevel: consumable?.minStockLevel ?? 0,
      unitId: consumable?.unitId ?? "",
      note: consumable?.note ?? "",
    },
  });
  const trpc = useTRPC();
  const unitQuery = useQuery(trpc.inventory.units.queryOptions());
  const queryClient = useQueryClient();
  const createConsumableMutation = useMutation(
    trpc.inventory.createConsumable.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success("Success", { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateConsumableMutation = useMutation(
    trpc.inventory.updateConsumable.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success("Success", { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const handleSubmit = (data: z.infer<typeof schema>) => {
    const values = {
      ...data,
      //currentStock: Number(data.currentStock),
      minStockLevel: Number(data.minStockLevel),
    };
    if (consumable) {
      updateConsumableMutation.mutate({
        id: consumable.id,
        ...values,
      });
    } else {
      createConsumableMutation.mutate(values);
    }
  };

  const t = useTranslations();

  const { openModal } = useModal();
  const { closeSheet } = useSheet();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4 px-4">
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
            name="minStockLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Min level stock")}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Unit")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => {
                      if (val === "add") {
                        openModal({
                          title: t("Create a stock unit"),
                          view: <CreateEditStockUnit />,
                        });
                      } else {
                        field.onChange(val);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitQuery.isPending ? (
                        <SelectItem value="loading">
                          <Skeleton className="h-8" />
                        </SelectItem>
                      ) : (
                        <>
                          {unitQuery.data?.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {!unitQuery.isPending && (
                        <SelectItem value="add">
                          <PlusCircle className="h-3 w-3" />
                          {t("Create a stock unit")}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
                <FormLabel>{t("note")}</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                closeSheet();
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              disabled={
                createConsumableMutation.isPending ||
                updateConsumableMutation.isPending
              }
              type="submit"
            >
              {(createConsumableMutation.isPending ||
                updateConsumableMutation.isPending) && <Spinner />}
              {t("submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
