"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { UserRoleLevel } from "@repo/db/enums";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  level: z.enum(UserRoleLevel),
  isActive: z.boolean().optional().default(true),
});

export function CreateEditUserRole() {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const createUserRoleMutation = useMutation(
    trpc.userRole.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.userRole.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      level: UserRoleLevel.LEVEL4,
      isActive: true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      toast.loading(t("creating"), { id: 0 });
      createUserRoleMutation.mutate({
        name: value.name,
        description: value.description,
        level: value.level,
        isActive: value.isActive ?? true,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <form
        id="create-user-role-form"
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
            name="level"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("level")}</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      value && field.handleChange(value as UserRoleLevel)
                    }
                    aria-invalid={isInvalid}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserRoleLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
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
        <FieldGroup className="col-span-full grid">
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t("description")}
                  </FieldLabel>
                  <Textarea
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
        <form.Field
          name="isActive"
          children={(field) => (
            <Field orientation="horizontal">
              <Checkbox
                checked={field.state.value ?? false}
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
          disabled={createUserRoleMutation.isPending}
          type="submit"
          form="create-user-role-form"
        >
          {createUserRoleMutation.isPending && <Spinner />}
          {t("submit")}
        </Button>
      </Field>
    </div>
  );
}
