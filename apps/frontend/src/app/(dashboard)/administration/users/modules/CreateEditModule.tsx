"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

type Module = RouterOutputs["module"]["all"][number];

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  code: z.string().min(1),
  isActive: z.boolean(),
});

export function CreateEditModule({ module }: { module?: Module }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const createModuleMutation = useMutation(
    trpc.module.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.module.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateModuleMutation = useMutation(
    trpc.module.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.module.all.pathFilter());
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
      name: module?.name ?? "",
      description: module?.description ?? "",
      code: module?.code ?? "",
      isActive: module?.isActive ?? true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        code: value.code,
        description: value.description,
        isActive: value.isActive,
      };

      if (module) {
        toast.loading(t("updating"), { id: 0 });
        updateModuleMutation.mutate({ id: module.id, ...payload });
      } else {
        toast.loading(t("creating"), { id: 0 });
        createModuleMutation.mutate(payload);
      }
    },
  });

  const isSubmitting =
    createModuleMutation.isPending || updateModuleMutation.isPending;

  return (
    <div className="flex flex-col gap-4">
      <form
        id="create-permission-form"
        className="grid grid-cols-1 gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup className="grid grid-cols-2 gap-4">
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
            name="code"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("code")}</FieldLabel>
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
        <FieldGroup className="col-span-full grid">
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Module</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  ></Textarea>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <form.Field
          name="isActive"
          children={(field) => (
            <Field orientation="horizontal">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(value) => field.handleChange(Boolean(value))}
                id={`${field.name}-toggle`}
              />
              <FieldLabel
                htmlFor={`${field.name}-toggle`}
                className="font-normal"
              >
                {t("active")}
              </FieldLabel>
            </Field>
          )}
        />
      </form>
      <Field orientation="horizontal" className="justify-end">
        <Button variant="secondary" type="button" onClick={() => closeModal()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
          form="create-permission-form"
        >
          {isSubmitting && <Spinner />}
          {t("submit")}
        </Button>
      </Field>
    </div>
  );
}
