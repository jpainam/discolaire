"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import type { Fee } from "@repo/db/client";

import { DatePicker } from "~/components/DatePicker";
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
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const createEditFeeSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  amount: z.coerce.number().min(1),
  dueDate: z.date(),
  journalId: z.string().min(1),
});

export function CreateEditFee({
  fee,
  classroomId,
}: {
  fee?: Fee;
  classroomId: string;
}) {
  const t = useTranslations();
  const form = useForm({
    defaultValues: {
      code: fee?.code ?? "",
      description: fee?.description ?? "",
      amount: fee?.amount ?? 0,
      dueDate: fee?.dueDate ?? new Date(),
      journalId: fee?.journalId ?? "",
    },
    validators: {
      onSubmit: createEditFeeSchema,
    },
    onSubmit: ({ value }) => {
      const values = {
        code: value.code,
        description: value.description,
        amount: value.amount,
        dueDate: value.dueDate,
        isActive: true,
        classroomId: classroomId,
        journalId: value.journalId,
      };
      if (fee) {
        toast.loading(t("updating"), { id: 0 });
        updateFeeMutation.mutate({ id: fee.id, ...values });
      } else {
        toast.loading(t("creating"), { id: 0 });
        createFeeMutation.mutate(values);
      }
    },
  });

  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const journalQuery = useQuery(trpc.accountingJournal.all.queryOptions());

  const updateFeeMutation = useMutation(
    trpc.fee.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.fee.all.pathFilter());
        await queryClient.invalidateQueries(trpc.classroom.fees.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const createFeeMutation = useMutation(
    trpc.fee.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.fee.all.pathFilter());
        await queryClient.invalidateQueries(trpc.classroom.fees.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <form
        id="create-fee-form"
        className="grid grid-cols-2 gap-x-2 gap-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup className="col-span-full grid grid-cols-[75px_1fr] gap-2">
          <form.Field
            name="code"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    className="w-[75px]"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <FieldGroup className="col-span-full grid grid-cols-2 gap-2">
          <form.Field
            name="amount"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("amount")}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="number"
                    min="1"
                    step="1"
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const nextValue = event.target.valueAsNumber;
                      field.handleChange(
                        Number.isNaN(nextValue) ? 0 : nextValue,
                      );
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="dueDate"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("due_date")}</FieldLabel>
                  <DatePicker
                    defaultValue={field.state.value}
                    onSelectAction={(val) => val && field.handleChange(val)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <FieldGroup className="col-span-full grid grid-cols-2 gap-2">
          <form.Field
            name="journalId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="col-span-full">
                  <FieldLabel htmlFor={field.name} className="sr-only">
                    {t("Accounting Journals")}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    aria-invalid={isInvalid}
                  >
                    <SelectTrigger className="w-full" id={field.name}>
                      <SelectValue placeholder={t("Accounting Journals")} />
                    </SelectTrigger>
                    <SelectContent>
                      {journalQuery.isPending ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </SelectItem>
                      ) : (
                        journalQuery.data?.map((journal) => (
                          <SelectItem key={journal.id} value={journal.id}>
                            {journal.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        {/* <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-4 space-y-0 py-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t("is_active")}</FormLabel>
            </FormItem>
          )}
        /> */}
      </form>
      <Field orientation="horizontal" className="justify-end">
        <Button
          onClick={() => {
            closeModal();
          }}
          variant="outline"
          type="button"
        >
          {t("cancel")}
        </Button>

        <Button
          disabled={updateFeeMutation.isPending || createFeeMutation.isPending}
          type="submit"
          form="create-fee-form"
        >
          {(updateFeeMutation.isPending || createFeeMutation.isPending) && (
            <Spinner />
          )}
          {fee ? t("edit") : t("submit")}
        </Button>
      </Field>
    </div>
  );
}
