"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import { RoleLevel } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTRPC } from "~/trpc/react";

type ProfileType = "staff" | "student" | "contact" | "";

const createUserSchema = z
  .object({
    fullName: z.string(),
    username: z.string().min(1),
    profile: z
      .enum(["staff", "student", "contact", ""])
      .refine((value) => value !== "", {
        message: "Le profil est requis.",
      }),
    email: z.union([z.email(), z.literal("")]),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
    entityId: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Les mots de passe ne correspondent pas.",
      });
    }
  });

export function CreateEditUser() {
  const trpc = useTRPC();
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const { data: roles } = useSuspenseQuery(trpc.role.all.queryOptions());
  const queryClient = useQueryClient();
  const t = useTranslations();
  const form = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      profile: "" as ProfileType,
      email: "",
      password: "",
      confirmPassword: "",
      entityId: "",
    },
    validators: {
      onSubmit: createUserSchema,
    },
    onSubmit: ({ value }) => {
      createUserMutation.mutate({
        username: value.username,
        password: value.password,
        profile: value.profile as "staff" | "student" | "contact",
        email: value.email,
        entityId: value.entityId,
      });
    },
  });

  const createUserMutation = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        form.reset();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );

  return (
    <div className="grid grid-cols-1 items-start gap-4 p-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Information de l'utilisateurs</CardTitle>
          <CardDescription>Entrer les information utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="create-user-form"
            className="grid grid-cols-1 gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="fullName">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Nom complet</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="username">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="profile">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Profile</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value as ProfileType);
                        }}
                      >
                        <SelectTrigger
                          className="w-full"
                          id={field.name}
                          aria-invalid={isInvalid}
                        >
                          <SelectValue placeholder="Profile" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="contact">Contact</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </Field>
                )}
              </form.Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="confirmPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Confirmer mot de passe
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            form="create-user-form"
            disabled={createUserMutation.isPending}
            type="submit"
          >
            {t("submit")}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles de l'utilisateur</CardTitle>
          <CardDescription>
            Sélectionner un ou plusieurs rôles pour cet utilisateurs. Les
            permissions seront héritées des rôles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-2">
            {roles.map((r, index) => {
              return (
                <FieldLabel key={index}>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="toggle-checkbox-2"
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRoleIds([...roleIds, r.id]);
                        } else {
                          setRoleIds((ids) => ids.filter((id) => id != r.id));
                        }
                      }}
                      name="toggle-checkbox-2"
                    />
                    <FieldContent>
                      <FieldTitle>
                        {r.name}
                        <Badge
                          size={"xs"}
                          className=""
                          //className="size-1.5 h-5 text-[8px]"
                          variant={
                            r.level == RoleLevel.LEVEL1
                              ? "destructive"
                              : r.level == RoleLevel.LEVEL2
                                ? "primary"
                                : r.level == RoleLevel.LEVEL3
                                  ? "info"
                                  : r.level == RoleLevel.LEVEL4
                                    ? "secondary"
                                    : "warning"
                          }
                          appearance={"light"}
                        >
                          {r.level}
                        </Badge>
                      </FieldTitle>
                      <FieldDescription>{r.description}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              );
            })}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
