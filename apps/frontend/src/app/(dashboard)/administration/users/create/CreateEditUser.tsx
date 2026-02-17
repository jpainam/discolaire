"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import { RoleLevel } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
import { ContactSearchDialog } from "~/components/contacts/ContactSearchDialog";
import { StaffSearchDialog } from "~/components/staffs/StaffSearchDialog";
import { StudentSearchDialog } from "~/components/students/StudentSearchDialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

type ProfileType = "staff" | "student" | "contact" | "";

const createUserSchema = z
  .object({
    username: z.string().min(1),
    profile: z
      .enum(["staff", "student", "contact", ""])
      .refine((value) => value !== "", {
        message: "Le profil est requis.",
      }),
    email: z.union([z.email(), z.literal("")]),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
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
  const [selectedEntity, setSelectedEntity] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const { data: roles } = useSuspenseQuery(trpc.role.all.queryOptions());
  const queryClient = useQueryClient();
  const t = useTranslations();
  const { openModal } = useModal();

  const assignRoleMutation = useMutation(
    trpc.role.addUsers.mutationOptions({
      onError: (err) => {
        toast.error(`Erreur lors de l'attribution du rôle: ${err.message}`, {
          id: 0,
        });
      },
    }),
  );

  const createUserMutation = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: async (newUser) => {
        if (roleIds.length > 0) {
          await Promise.all(
            roleIds.map((roleId) =>
              assignRoleMutation.mutateAsync({
                roleId,
                userIds: [newUser.id],
              }),
            ),
          );
        }

        await queryClient.invalidateQueries(trpc.user.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        form.reset();
        setSelectedEntity(null);
        setRoleIds([]);
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );

  const [entityError, setEntityError] = useState<string | null>(null);

  const openEntitySearchModal = (profile: "staff" | "student" | "contact") => {
    const handleSelect = (entity: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      userId: string | null;
    }) => {
      if (entity.userId) {
        setSelectedEntity(null);
        setEntityError(
          `${getFullName(entity)} possède déjà un compte utilisateur.`,
        );
        return;
      }
      setEntityError(null);
      setSelectedEntity({
        id: entity.id,
        label: getFullName(entity),
      });
    };

    const titles: Record<string, string> = {
      staff: "Rechercher un personnel",
      student: "Rechercher un élève",
      contact: "Rechercher un contact",
    };

    if (profile === "staff") {
      openModal({
        className: "sm:max-w-xl",
        view: <StaffSearchDialog onSelect={handleSelect} />,
        title: titles[profile],
        description:
          "Sélectionner le personnel à associer au compte utilisateur",
      });
    } else if (profile === "student") {
      openModal({
        className: "sm:max-w-xl",
        view: <StudentSearchDialog onSelect={handleSelect} />,
        title: titles[profile],
        description: "Sélectionner l'élève à associer au compte utilisateur",
      });
    } else {
      openModal({
        className: "sm:max-w-xl",
        view: <ContactSearchDialog onSelect={handleSelect} />,
        title: titles[profile],
        description: "Sélectionner le contact à associer au compte utilisateur",
      });
    }
  };

  const form = useForm({
    defaultValues: {
      username: "",
      profile: "" as ProfileType,
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: createUserSchema,
    },
    onSubmit: ({ value }) => {
      if (!selectedEntity) return;
      const profile = value.profile as "staff" | "student" | "contact";
      createUserMutation.mutate({
        username: value.username,
        password: value.password,
        profile,
        email: value.email,
        entityId: selectedEntity.id,
      });
    },
  });

  return (
    <div className="grid grid-cols-1 items-start gap-4 p-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Information de l'utilisateur</CardTitle>
          <CardDescription>Entrer les informations utilisateur</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="create-user-form"
            className="grid grid-cols-1 gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
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
                          setSelectedEntity(null);
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      type="email"
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

            {entityError && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
                {entityError}
              </div>
            )}

            {selectedEntity && (
              <div className="bg-muted flex items-center justify-between rounded-md border p-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    Entité sélectionnée:{" "}
                  </span>
                  <span className="font-medium">{selectedEntity.label}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSelectedEntity(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex justify-end">
              {selectedEntity ? (
                <Button disabled={createUserMutation.isPending} type="submit">
                  {createUserMutation.isPending ? "Création..." : "Créer"}
                </Button>
              ) : (
                <form.Subscribe selector={(state) => state.values.profile}>
                  {(profile) => (
                    <Button
                      type="button"
                      disabled={!profile}
                      onClick={() => {
                        if (profile) {
                          openEntitySearchModal(profile);
                        }
                      }}
                    >
                      {!profile
                        ? "Sélectionner un profil"
                        : `Sélectionner un ${profile === "staff" ? "personnel" : profile === "student" ? "élève" : "contact"}`}
                    </Button>
                  )}
                </form.Subscribe>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rôles de l'utilisateur</CardTitle>
          <CardDescription>
            Sélectionner un ou plusieurs rôles pour cet utilisateur. Les
            permissions seront héritées des rôles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-2">
            {roles.map((r) => {
              const isChecked = roleIds.includes(r.id);
              return (
                <FieldLabel key={r.id}>
                  <Field orientation="horizontal">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRoleIds([...roleIds, r.id]);
                        } else {
                          setRoleIds((ids) => ids.filter((id) => id !== r.id));
                        }
                      }}
                    />
                    <FieldContent>
                      <FieldTitle>
                        {r.name}
                        <Badge
                          size={"xs"}
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
