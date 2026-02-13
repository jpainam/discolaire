"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const updateRegistrationNumberSchema = z.object({
  registrationNumber: z.string().min(1),
});

export function UpdateRegistrationNumber({
  studentId,
  registrationNumber,
  formId = "update-registration-number-form",
}: {
  studentId: string;
  registrationNumber?: string | null;
  formId?: string;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const updateRegistrationMutation = useMutation(
    trpc.student.updateRegistration.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.get.pathFilter());
        await queryClient.invalidateQueries(trpc.student.pathFilter());
        await queryClient.invalidateQueries(trpc.contact.pathFilter());
        await queryClient.invalidateQueries(trpc.studentContact.pathFilter());
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      registrationNumber: registrationNumber ?? "",
    },
    validators: {
      onSubmit: updateRegistrationNumberSchema,
    },
    onSubmit: ({ value }) => {
      const registrationNumber = value.registrationNumber.trim();
      toast.loading(t("updating"), { id: 0 });
      updateRegistrationMutation.mutate({
        studentId: studentId,
        registrationNumber,
      });
    },
  });

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="registrationNumber"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                {t("registrationNumber")}
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={t("registrationNumber")}
                autoComplete="off"
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <div className="flex items-center justify-end gap-2">
        <Button
          variant={"secondary"}
          type="button"
          onClick={() => {
            closeModal();
          }}
        >
          {t("close")}
        </Button>
        <Button disabled={updateRegistrationMutation.isPending} type="submit">
          {updateRegistrationMutation.isPending && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
