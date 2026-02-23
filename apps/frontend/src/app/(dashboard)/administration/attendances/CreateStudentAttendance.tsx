"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import { StudentSelector } from "~/components/shared/selects/StudentSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
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
  studentId: z.string().min(1),
  termId: z.string().min(1),
  absence: toNonNegInt,
  chatter: toNonNegInt,
  consigne: toNonNegInt,
  exclusion: toNonNegInt,
  late: toNonNegInt,
});

export function CreateStudentAttendance() {
  const trpc = useTRPC();
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const createMutation = useMutation(
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

  const form = useForm({
    defaultValues: {
      studentId: "",
      termId: "",
      absence: 0,
      chatter: 0,
      consigne: 0,
      exclusion: 0,
      late: 0,
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
      toast.loading(t("Processing"), { id: 0 });
      createMutation.mutate({
        studentId: parsed.data.studentId,
        termId: parsed.data.termId,
        absence: parsed.data.absence,
        chatter: parsed.data.chatter,
        consigne: parsed.data.consigne,
        exclusion: parsed.data.exclusion,
        late: parsed.data.late,
        justifiedAbsence: 0,
        justifiedLate: 0,
      });
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
      className="grid grid-cols-2 gap-4"
    >
      <form.Field
        name="studentId"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field className="col-span-full" data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{t("student")}</FieldLabel>
              </FieldContent>
              <StudentSelector
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
        name="termId"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field className="col-span-full" data-invalid={isInvalid}>
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
        name="consigne"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Consignes</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Exclusions</FieldLabel>
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

      <div className="col-span-full flex flex-row items-center justify-end gap-2">
        <Button onClick={closeModal} type="button" variant="outline">
          {t("cancel")}
        </Button>
        <Button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
