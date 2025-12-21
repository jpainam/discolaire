"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});
export function CreateEditShortcut({
  shortcut,
}: {
  shortcut: RouterOutputs["shortcut"]["search"][number];
}) {
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const updateShortcut = useMutation(
    trpc.shortcut.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.shortcut.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const t = useTranslations();
  const form = useForm({
    defaultValues: {
      title: shortcut.title,
      url: shortcut.url,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      toast.loading(t("updating"), { id: 0 });

      updateShortcut.mutate({
        id: shortcut.id,
        title: value.title,
        url: value.url,
      });
    },
  });
  return (
    <div className="grid gap-4">
      <form
        id="create-shortcut-form"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="title"
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
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="url"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </form>

      <Field orientation="horizontal" className="flex items-center justify-end">
        <Button type="button" variant="outline" onClick={() => closeModal()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={updateShortcut.isPending}
          type="submit"
          form="create-shortcut-form"
        >
          {updateShortcut.isPending && <Spinner />}
          {t("submit")}
        </Button>
      </Field>
    </div>
  );
}
