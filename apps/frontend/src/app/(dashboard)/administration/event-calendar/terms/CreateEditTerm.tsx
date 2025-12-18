"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import * as z from "zod";

import type { RouterOutputs } from "@repo/api";
import { TermType } from "@repo/db/enums";

import { DatePicker } from "~/components/DatePicker";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

type Term = RouterOutputs["term"]["all"][number];

const formSchema = z.object({
  name: z.string().min(2),
  type: z.enum([
    TermType.MONTHLY,
    TermType.QUARTER,
    TermType.HALF,
    TermType.ANNUAL,
  ]),
  order: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  parts: z.string().array(),
});
export function CreateEditTerm({ term }: { term?: Term }) {
  const [today] = useState(() => new Date());
  const form = useForm({
    defaultValues: {
      name: term?.name ?? "",
      type: term?.type ?? TermType.MONTHLY,
      order: term?.order ? String(term.order) : "1",
      startDate: term?.startDate ?? today,
      endDate: term?.endDate ?? addMonths(today, 2),
      parts: term?.parts.map((t) => t.childId) ?? [],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log("Inside onSubmit>>>>>");
      const values = {
        name: value.name,
        startDate: value.startDate,
        endDate: value.endDate,
        order: Number(value.order),
        parts: value.parts,
        type: value.type,
      };
      if (term) {
        toast.loading(t("updating"), { id: 0 });
        updateTermMutation.mutate({ id: term.id, ...values });
      } else {
        toast.loading(t("creating"), { id: 0 });
        createTermMutation.mutate(values);
      }
    },
  });
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: terms, isPending } = useQuery(trpc.term.all.queryOptions());

  const { closeModal } = useModal();
  const createTermMutation = useMutation(
    trpc.term.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.term.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateTermMutation = useMutation(
    trpc.term.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.term.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const t = useTranslations();
  //const onSubmit = (data: z.infer<typeof createEditTermSchema>) => {};
  return (
    <div className="flex flex-col gap-4">
      <form
        id="create-term-form"
        className="grid grid-cols-1 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("Label")}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="ex. Mensuelle 1, Trimestre 1"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <FieldGroup className="grid grid-cols-2 gap-4">
          <form.Field
            name="type"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Type de la période
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(v) =>
                      v && field.handleChange(v as TermType)
                    }
                    aria-invalid={isInvalid}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TermType.MONTHLY}>
                        {t(TermType.MONTHLY)}
                      </SelectItem>
                      <SelectItem value={TermType.QUARTER}>
                        {t(TermType.QUARTER)}
                      </SelectItem>
                      <SelectItem value={TermType.HALF}>
                        {t(TermType.HALF)}
                      </SelectItem>
                      <SelectItem value={TermType.ANNUAL}>
                        {t(TermType.ANNUAL)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="order"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Type de la période
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    aria-invalid={isInvalid}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }).map((_, t) => (
                        <SelectItem key={t} value={(t + 1).toString()}>
                          {t + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <FieldGroup className="grid grid-cols-2 gap-4">
          <form.Field
            name="startDate"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t("Start date")}
                  </FieldLabel>
                  <DatePicker
                    onSelectAction={(v) => v && field.handleChange(v)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="endDate"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("End date")}</FieldLabel>
                  <DatePicker
                    onSelectAction={(v) => v && field.handleChange(v)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <FieldSeparator />
        <Label className="col-span-full">Composition</Label>
        {isPending ? (
          <Skeleton className="h-12" />
        ) : (
          <FieldGroup className="border-border bg-muted/30 grid grid-cols-2 rounded-lg border p-2">
            {terms?.map((t, index) => {
              return (
                <form.Field
                  key={t.id}
                  name="parts"
                  children={(field) => {
                    const isChecked = field.state.value.includes(t.id);
                    const handleChange = (checked: boolean) => {
                      if (checked) {
                        field.handleChange([...field.state.value, t.id]);
                      } else {
                        field.handleChange(
                          field.state.value.filter((v) => v != t.id),
                        );
                      }
                    };
                    return (
                      <Field orientation="horizontal">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(e) => handleChange(!!e)}
                          id={`${t.id}-${index}`}
                        />
                        <FieldLabel
                          htmlFor={`${t.id}-${index}`}
                          className="font-normal"
                        >
                          {t.name}
                        </FieldLabel>
                      </Field>
                    );
                  }}
                />
              );
            })}
          </FieldGroup>
        )}
      </form>
      <Field orientation="horizontal" className="justify-end">
        <Button
          variant={"secondary"}
          type="button"
          onClick={() => closeModal()}
        >
          {t("cancel")}
        </Button>
        <Button
          disabled={
            updateTermMutation.isPending || createTermMutation.isPending
          }
          type="submit"
          form="create-term-form"
        >
          {(updateTermMutation.isPending || createTermMutation.isPending) && (
            <Spinner />
          )}
          {t("submit")}
        </Button>
      </Field>
    </div>
  );
}
