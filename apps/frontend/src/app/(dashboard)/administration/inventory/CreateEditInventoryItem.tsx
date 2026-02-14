"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
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
import { useModal } from "~/hooks/use-modal";
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
  const { closeModal } = useModal();
  const { closeSheet } = useSheet();
  const closeContainer = () => {
    closeSheet();
    closeModal();
  };

  const defaultTrackingType: z.input<typeof schema>["trackingType"] =
    item?.type === "ASSET" ? "RETURNABLE" : "CONSUMABLE";

  const defaultValues: z.input<typeof schema> = {
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
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      toast.loading(t("Processing"), { id: 0 });

      const payload = {
        name: value.name,
        trackingType: value.trackingType,
        unitId: value.trackingType === "CONSUMABLE" ? value.unitId : undefined,
        minStockLevel:
          value.trackingType === "CONSUMABLE" ? value.minStockLevel : undefined,
        sku: value.trackingType === "RETURNABLE" ? value.sku : undefined,
        serial: value.trackingType === "RETURNABLE" ? value.serial : undefined,
        defaultReturnDate:
          value.trackingType === "RETURNABLE"
            ? value.defaultReturnDate
            : undefined,
        note: value.note,
      };

      if (item) {
        updateItemMutation.mutate({
          id: item.id,
          ...payload,
        });
        return;
      }

      createItemMutation.mutate(payload);
    },
  });

  const trackingType = useStore(
    form.store,
    (state) => state.values.trackingType,
  );

  const unitsQuery = useQuery(trpc.inventory.units.queryOptions());

  const createItemMutation = useMutation(
    trpc.inventory.createItem.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeContainer();
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
        closeContainer();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const isPending =
    createItemMutation.isPending || updateItemMutation.isPending;

  return (
    <form
      id="create-inventory-item-form"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="grid gap-6"
    >
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("name")}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="trackingType"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{"Tracking type"}</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "CONSUMABLE" | "RETURNABLE")
                  }
                  aria-invalid={isInvalid}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSUMABLE">
                      {"One-time usage"}
                    </SelectItem>
                    <SelectItem value="RETURNABLE">{"Returnable"}</SelectItem>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {trackingType === "CONSUMABLE" && (
          <>
            <form.Field
              name="unitId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t("Unit")}</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger id={field.name}>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="minStockLevel"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t("Min level stock")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      value={
                        typeof field.state.value === "number" ||
                        typeof field.state.value === "string"
                          ? field.state.value
                          : ""
                      }
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(Number(event.target.value))
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </>
        )}

        {trackingType === "RETURNABLE" && (
          <>
            <form.Field
              name="sku"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t("Sku")}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="serial"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t("Serial number")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="defaultReturnDate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {"Expected return date"}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </>
        )}

        <form.Field
          name="note"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("note")}</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  className="resize-none"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <div className="ml-auto flex items-center gap-2">
        <Button type="button" variant="outline" onClick={closeContainer}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
