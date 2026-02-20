"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { RoleLevel } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
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
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "~/components/ui/field";
import { useTRPC } from "~/trpc/react";

interface UserRoleCardProps {
  userId: string;
  currentRoleIds: string[];
}

export function UserRoleCard({ userId, currentRoleIds }: UserRoleCardProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const { data: roles } = useSuspenseQuery(trpc.role.all.queryOptions());

  const addRole = useMutation(
    trpc.role.addUsers.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.role.pathFilter());
        await queryClient.invalidateQueries(trpc.user.pathFilter());
        await queryClient.invalidateQueries(trpc.staff.pathFilter());
        toast.success("Rôle ajouté");
      },
      onError: () => {
        toast.error("Erreur lors de l'ajout du rôle");
      },
    }),
  );

  const removeRole = useMutation(
    trpc.role.removeUser.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.role.pathFilter());
        await queryClient.invalidateQueries(trpc.user.pathFilter());
        await queryClient.invalidateQueries(trpc.staff.pathFilter());
        toast.success("Rôle retiré");
      },
      onError: () => {
        toast.error("Erreur lors du retrait du rôle");
      },
    }),
  );

  const isPending = addRole.isPending || removeRole.isPending;

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      addRole.mutate({ roleId, userIds: [userId] });
    } else {
      removeRole.mutate({ roleId, userId });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("User roles")}</CardTitle>
        <CardDescription>
          Sélectionner un ou plusieurs rôles pour cet utilisateur. Les
          permissions seront héritées des rôles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {roles.map((r) => {
            const isChecked = currentRoleIds.includes(r.id);
            return (
              <FieldLabel key={r.id}>
                <Field orientation="horizontal">
                  <Checkbox
                    checked={isChecked}
                    disabled={isPending}
                    onCheckedChange={(checked) => {
                      handleRoleToggle(r.id, !!checked);
                    }}
                  />
                  <FieldContent>
                    <FieldTitle>
                      {r.name}
                      <Badge
                        size="xs"
                        variant={
                          r.level === RoleLevel.LEVEL1
                            ? "destructive"
                            : r.level === RoleLevel.LEVEL2
                              ? "primary"
                              : r.level === RoleLevel.LEVEL3
                                ? "info"
                                : r.level === RoleLevel.LEVEL4
                                  ? "secondary"
                                  : "warning"
                        }
                        appearance="light"
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
  );
}
