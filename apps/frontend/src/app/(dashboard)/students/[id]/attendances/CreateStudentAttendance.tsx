"use client";

import { useParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import type { RouterOutputs } from "@repo/api";

import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const toNonNegInt = z.preprocess(
  (v) => (v === "" || v == null ? 0 : v),
  z.number().int().nonnegative(),
);
const formSchema = z.object({
  absence: toNonNegInt,
  justifiedAbsence: toNonNegInt,
  consigne: toNonNegInt,
  late: toNonNegInt,
  justifiedLate: toNonNegInt,
  chatter: toNonNegInt,
  exclusion: toNonNegInt,
  termId: z.string().min(1),
  notify: z.coerce.boolean().default(false),
});
export function CreateStudentAttendance({
  attendance,
}: {
  attendance?: RouterOutputs["attendance"]["student"][number];
}) {
  const trpc = useTRPC();
  const { closeModal } = useModal();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const createAttendanceMutation = useMutation(
    trpc.attendance.createStudent.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const updateAttendanceMutation = useMutation(
    trpc.attendance.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const form = useForm({
    defaultValues: {
      absence: attendance?.absence,
      justifiedAbsence: attendance?.justifiedAbsence,
      late: attendance?.late,
      justifiedLate: attendance?.justifiedLate,
      exclusion: attendance?.exclusion,
      consigne: attendance?.consigne,
      chatter: attendance?.chatter,
      termId: "",
      notify: false,
    },
    validators: {
      onSubmit: ({ value }) => {
        const parsed = formSchema.safeParse(value);
        if (!parsed.success) {
          return { error: parsed.error.flatten().fieldErrors };
        }
      },
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.safeParse(value);
      if (!parsed.success) {
        toast.error(t("validation_error"));
        return;
      }
      toast.loading(t("Processing"), { id: 0 });
      const values = {
        absence: parsed.data.absence,
        justifiedAbsence: parsed.data.justifiedAbsence,
        late: parsed.data.late,
        justifiedLate: parsed.data.justifiedLate,
        exclusion: parsed.data.exclusion,
        consigne: parsed.data.consigne,
        chatter: parsed.data.chatter,
      };
      if (attendance) {
        updateAttendanceMutation.mutate({
          id: attendance.id,
          ...values,
        });
      } else {
        createAttendanceMutation.mutate({
          studentId: params.id,
          termId: parsed.data.termId,
          ...values,
        });
      }
    },
  });

  const t = useTranslations();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
      className="grid grid-cols-2 gap-4"
    >
      <form.Field
        name="termId"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{t("terms")}</FieldLabel>
              </FieldContent>
              <TermSelector
                onChange={(val) => {
                  field.handleChange(val ?? "");
                }}
              />

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="absence"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Absences</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                type="number"
                min={0}
                name={field.name}
                value={Number(field.state.value)}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="late"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Retards</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                type="number"
                min={0}
                name={field.name}
                value={Number(field.state.value)}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="justifiedAbsence"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Absences justifiées
                </FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                type="number"
                min={0}
                name={field.name}
                value={Number(field.state.value)}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="justifiedLate"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Retards justifiés</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                type="number"
                name={field.name}
                min={0}
                value={Number(field.state.value)}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="chatter"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Bavardages</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                type="number"
                min={0}
                name={field.name}
                value={Number(field.state.value)}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="exclusion"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Exclusion</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                type="number"
                min={0}
                name={field.name}
                value={Number(field.state.value)}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="consigne"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Consigne</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                type="number"
                min={0}
                name={field.name}
                value={Number(field.state.value)}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="notify"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <>
              <FieldGroup className="col-span-full" data-slot="checkbox-group">
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                  <FieldLabel htmlFor={field.name} className="font-normal">
                    {t("Send notification to parent")}
                  </FieldLabel>
                </Field>
              </FieldGroup>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </>
          );
        }}
      />

      <div className="col-span-full flex flex-row items-center justify-end gap-2">
        <Button
          onClick={() => {
            closeModal();
          }}
          type="button"
          variant="outline"
        >
          {t("cancel")}
        </Button>
        <Button
          disabled={
            createAttendanceMutation.isPending ||
            updateAttendanceMutation.isPending
          }
          type="submit"
        >
          {(createAttendanceMutation.isPending ||
            updateAttendanceMutation.isPending) && <Spinner />}
          {attendance ? t("update") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
