/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileTextIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { PermissionType } from "@repo/db/enums";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

type Permission = RouterOutputs["permission"]["all"][number];

const formSchema = z.object({
  name: z.string().min(1),
  moduleId: z.string().min(1),
  resource: z.string().min(1),
  type: z.enum(PermissionType),
  isActive: z.boolean().optional().default(true),
});

export function CreateEditPermission({
  permission,
}: {
  permission?: Permission;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const { data: modules, isPending: isPendingModule } = useQuery(
    trpc.module.all.queryOptions(),
  );

  const createPermissionMutation = useMutation(
    trpc.permission.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.permission.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updatePermissionMutation = useMutation(
    trpc.permission.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.permission.all.pathFilter());
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
      name: permission?.name ?? "",
      moduleId: permission?.moduleId ?? "",
      resource: permission?.resource ?? "",
      type: permission?.type ?? PermissionType.ACTION,
      isActive: permission?.isActive ?? true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        moduleId: value.moduleId,
        resource: value.resource,
        type: value.type,
        isActive: value.isActive,
      };

      if (permission) {
        toast.loading(t("updating"), { id: 0 });
        updatePermissionMutation.mutate({ id: permission.id, ...payload });
      } else {
        toast.loading(t("creating"), { id: 0 });
        createPermissionMutation.mutate(payload);
      }
    },
  });

  const isSubmitting =
    createPermissionMutation.isPending || updatePermissionMutation.isPending;

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
            name="resource"
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
        <FieldGroup className="grid grid-cols-2 gap-4">
          <form.Field
            name="moduleId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Module</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      value && field.handleChange(value)
                    }
                    aria-invalid={isInvalid}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("Modules")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isPendingModule && (
                        <SelectItem value="-1" disabled>
                          {" "}
                          <Skeleton className="w-full" />
                        </SelectItem>
                      )}
                      {modules?.map((m, index) => (
                        <SelectItem key={index} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="type"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("type")}</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      value && field.handleChange(value as PermissionType)
                    }
                    aria-invalid={isInvalid}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PermissionType.MENU}>
                        {PermissionType.MENU}
                      </SelectItem>
                      <SelectItem value={PermissionType.ACTION}>
                        {PermissionType.ACTION}
                      </SelectItem>
                      <SelectItem value={PermissionType.API}>
                        {PermissionType.API}
                      </SelectItem>
                      <SelectItem value={PermissionType.REPORT}>
                        {PermissionType.REPORT}
                      </SelectItem>
                    </SelectContent>
                  </Select>
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

export function AddPermissionToRole({
  permission,
}: {
  permission: RouterOutputs["permission"]["all"][number];
}) {
  const { closeSheet } = useSheet();
  const trpc = useTRPC();
  const t = useTranslations();
  const queryClient = useQueryClient();
  const router = useRouter();
  const rolesQuery = useQuery(trpc.userRole.all.queryOptions());
  const [permissionIds, setPermissionIds] = useState<string[]>([]);
  const addToRoleMutation = useMutation(
    trpc.permission.addToRole.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.permission.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
    }),
  );
  if (rolesQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 4 }).map((_, t) => (
          <Skeleton className="h-8" key={t} />
        ))}
      </div>
    );
  }
  const roles = rolesQuery.data ?? [];
  if (roles.length == 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>Aucun rôle</EmptyTitle>
          <EmptyDescription>
            Veuillez commencer par ajouter quelques rôles
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            onClick={() => {
              router.push(`/administration/users/roles`);
            }}
          >
            {t("add")}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {roles.map((r) => {
        return (
          <Label htmlFor={r.id.toString()} key={r.id} className="!w-fit">
            <div className="flex gap-1.5 overflow-hidden !px-3 !py-1.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-2">
              <Checkbox
                value={r.id.toString()}
                id={r.id.toString()}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    setPermissionIds((w) => w.filter((pId) => pId !== r.id));
                  } else {
                    setPermissionIds((w) => [...w, r.id]);
                  }
                }}
                defaultChecked={permissionIds.includes(r.id)}
                className="-ml-6 -translate-x-1 rounded-full transition-all duration-100 ease-linear data-[state=checked]:ml-0 data-[state=checked]:translate-x-0"
              />
              <Label>{r.name}</Label>
            </div>
          </Label>
        );
      })}
      <Button
        variant={"outline"}
        onClick={() => {
          closeSheet();
        }}
      ></Button>
    </div>
  );
}
