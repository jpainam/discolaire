"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { DatePicker } from "~/components/DatePicker";
import { ContactSelector } from "~/components/shared/selects/ContactSelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { StudentSelector } from "~/components/shared/selects/StudentSelector";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
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
import { BookSelector } from "../BookSelector";

const BORROWER_TYPES = ["student", "staff", "contact"] as const;
type BorrowerType = (typeof BORROWER_TYPES)[number];

const formSchema = z.object({
  bookId: z.string().min(1),
  borrowerType: z.enum(BORROWER_TYPES),
  borrowerId: z.string().min(1),
  borrowed: z.date(),
  returned: z.date().nullable(),
  expected: z.date().nullable(),
});

type LoanOutput = RouterOutputs["library"]["loans"]["data"][number];

function deriveBorrowerType(loan: LoanOutput): BorrowerType {
  if (loan.studentId) return "student";
  if (loan.staffId) return "staff";
  return "contact";
}

function deriveBorrowerId(loan: LoanOutput): string {
  return loan.studentId ?? loan.staffId ?? loan.contactId ?? "";
}

export function CreateEditLoan({ loan }: { loan?: LoanOutput }) {
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const createMutation = useMutation(
    trpc.library.createLoan.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        await queryClient.invalidateQueries(trpc.library.loans.pathFilter());
        toast.success("Loan created successfully", { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.library.updateLoan.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        await queryClient.invalidateQueries(trpc.library.loans.pathFilter());
        toast.success("Loan updated successfully", { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      bookId: loan?.bookId ?? "",
      borrowerType: loan
        ? deriveBorrowerType(loan)
        : ("student" as BorrowerType),
      borrowerId: loan ? deriveBorrowerId(loan) : "",
      borrowed: loan?.borrowed ?? new Date(),
      returned: loan?.returned ?? null,
      expected: loan ? loan.expected : addDays(new Date(), 14),
    },
    validators: {
      onSubmit: ({ value }) => {
        const parsed = formSchema.safeParse(value);
        if (!parsed.success) {
          return { error: z.treeifyError(parsed.error) };
        }
      },
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.safeParse(value);
      if (!parsed.success) {
        toast.error(t("validation_error"));
        return;
      }
      if (!loan) {
        createMutation.mutate(parsed.data);
      } else {
        updateMutation.mutate({
          id: loan.id,
          ...parsed.data,
        });
      }
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
      className="grid gap-4"
    >
      <form.Field
        name="bookId"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{t("books")}</FieldLabel>
              </FieldContent>
              <BookSelector
                className="w-full"
                onChange={(val) => field.handleChange(val ?? "")}
                defaultValue={field.state.value}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="borrowerType"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  {t("borrower_type")}
                </FieldLabel>
              </FieldContent>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  field.handleChange(val as BorrowerType);
                  form.setFieldValue("borrowerId", "");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">{t("student")}</SelectItem>
                  <SelectItem value="staff">{t("staff")}</SelectItem>
                  <SelectItem value="contact">{t("contact")}</SelectItem>
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Subscribe
        selector={(state) => state.values.borrowerType}
        children={(borrowerType) => (
          <form.Field
            name="borrowerId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {t("borrower")}
                    </FieldLabel>
                  </FieldContent>
                  {borrowerType === "student" ? (
                    <StudentSelector
                      className="w-full"
                      defaultValue={field.state.value}
                      onChange={(val) => field.handleChange(val ?? "")}
                    />
                  ) : borrowerType === "staff" ? (
                    <StaffSelector
                      className="w-full"
                      defaultValue={field.state.value}
                      onSelect={(val) => field.handleChange(val)}
                    />
                  ) : (
                    <ContactSelector
                      className="w-full"
                      defaultValue={field.state.value}
                      onChange={(val) => field.handleChange(val ?? "")}
                    />
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        )}
      />

      <form.Field
        name="borrowed"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{t("borrow_from")}</FieldLabel>
              </FieldContent>
              <DatePicker
                defaultValue={field.state.value}
                onSelectAction={(val) => {
                  if (val) field.handleChange(val);
                }}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="expected"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>{t("borrow_to")}</FieldLabel>
                </FieldContent>
                <DatePicker
                  defaultValue={field.state.value ?? undefined}
                  onSelectAction={(val) => field.handleChange(val ?? null)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="returned"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    {t("returned_date")}
                  </FieldLabel>
                </FieldContent>
                <DatePicker
                  defaultValue={field.state.value ?? undefined}
                  onSelectAction={(val) => field.handleChange(val ?? null)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
        <Button onClick={closeModal} type="button" variant="outline">
          {t("cancel")}
        </Button>
        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
