"use client";

import { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Search, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { RoleLevel } from "@repo/db/enums";

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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  level: z.enum(RoleLevel),
  isActive: z.boolean(),
});

export function CreateEditUserRole({
  role,
}: {
  role?: RouterOutputs["role"]["all"][number];
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const createUserRoleMutation = useMutation(
    trpc.role.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.role.all.pathFilter());
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
      name: role?.name ?? "",
      description: role?.description ?? "",
      level: role?.level ?? RoleLevel.LEVEL4,
      isActive: role?.isActive ?? true,
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
        isActive: value.isActive,
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
                      value && field.handleChange(value as RoleLevel)
                    }
                    aria-invalid={isInvalid}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RoleLevel).map((level) => (
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

export function AddPermissionToRole({ roleId }: { roleId: string }) {
  const trpc = useTRPC();
  const { data: permissions, isPending: permissionIsPending } = useQuery(
    trpc.permission.all.queryOptions(),
  );

  const { data: role, isPending: roleIsPending } = useQuery(
    trpc.role.get.queryOptions(roleId),
  );

  if (permissionIsPending || roleIsPending) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 4 }).map((_, t) => (
          <Skeleton className="h-20" key={t} />
        ))}
      </div>
    );
  }
  if (!permissions || permissions.length == 0) {
    return <div>Aucune permission</div>;
  }
  if (!role) {
    return <div>Aucun role</div>;
  }
  return (
    <AddPermissionToRoleForm
      key={role.id}
      roleId={roleId}
      role={role}
      permissions={permissions}
    />
  );
}

function AddPermissionToRoleForm({
  roleId,
  role,
  permissions,
}: {
  roleId: string;
  role: NonNullable<RouterOutputs["role"]["get"]>;
  permissions: NonNullable<RouterOutputs["permission"]["all"]>;
}) {
  const { closeSheet } = useSheet();
  const t = useTranslations();
  const [queryText, setQueryText] = useState<string>("");
  const debounce = useDebouncedCallback((value: string) => {
    setQueryText(value);
  }, 200);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [effects, setEffects] = useState<Map<string, "deny" | "allow">>(() => {
    const initials = new Map<string, "deny" | "allow">();
    role.permissionRoles.forEach((p) => {
      initials.set(p.permissionId, p.effect as "deny" | "allow");
    });
    return initials;
  });
  const [permissionIds, setPermissionIds] = useState<string[]>(() =>
    role.permissionRoles.map((p) => p.permissionId),
  );
  const addPermissionsToRole = useMutation(
    trpc.role.addPermissions.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.permission.pathFilter());
        await queryClient.invalidateQueries(trpc.role.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeSheet();
      },
    }),
  );
  const filtered = useMemo(() => {
    if (!queryText) return permissions;
    const q = queryText.toLowerCase();
    return permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.resource.toLowerCase().includes(q),
    );
  }, [permissions, queryText]);

  return (
    <div className="flex flex-col gap-2 pb-4">
      <div>
        <InputGroup className="w-full lg:w-1/2">
          <InputGroupInput
            placeholder={t("search")}
            onChange={(e) => debounce(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[20px]"></TableHead>
              <TableHead>{t("Label")}</TableHead>
              <TableHead className="w-[120px] text-right">Effect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p, index) => {
              return (
                <TableRow
                  key={index}
                  //className={cn(permissionIds.has(pd))}
                  data-state={permissionIds.includes(p.id) && "selected"}
                >
                  <TableCell>
                    <Checkbox
                      id={`checkbox-${p.id}`}
                      checked={permissionIds.includes(p.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPermissionIds([...permissionIds, p.id]);
                        } else {
                          setPermissionIds(
                            permissionIds.filter((id) => id !== p.id),
                          );
                        }
                      }}
                      defaultChecked={permissionIds.includes(p.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Label htmlFor={`checkbox-${p.id}`}>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">{p.name}</span>
                        <span className="text-primary text-xs">
                          {p.resource}
                        </span>
                      </div>
                    </Label>
                  </TableCell>

                  <TableCell className="text-right">
                    <Select
                      defaultValue={effects.get(p.id)}
                      onValueChange={(value) => {
                        setEffects((e) =>
                          e.set(p.id, value as "allow" | "deny"),
                        );
                        if (value.trim()) {
                          setPermissionIds([...permissionIds, p.id]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={"Choisir l'autorisation"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">
                          <CheckIcon className="text-green-500" />
                          {t("Allow")}
                        </SelectItem>
                        <SelectItem value="deny">
                          <XIcon className="text-red-500" />
                          {t("Deny")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Button
          disabled={addPermissionsToRole.isPending}
          onClick={() => {
            // check map
            const permissionMap: { id: string; effect: "deny" | "allow" }[] =
              [];
            let error = false;
            for (const pId of permissionIds) {
              const ef = effects.get(pId);
              if (!ef) {
                const p = permissions.find((p) => p.id == pId);
                toast.error(`Choisir une autorisation pour ${p?.name}`);
                error = true;
              } else {
                permissionMap.push({ id: pId, effect: ef });
              }
            }
            if (error) return;
            toast.loading(t("Processing"), { id: 0 });
            addPermissionsToRole.mutate({
              roleId,
              permissionIds: permissionMap,
            });
          }}
        >
          {addPermissionsToRole.isPending && <Spinner />}
          {t("submit")}
        </Button>
        <Button
          disabled={addPermissionsToRole.isPending}
          variant={"outline"}
          onClick={() => {
            closeSheet();
          }}
        >
          {t("close")}
        </Button>
      </div>
    </div>
  );
}
