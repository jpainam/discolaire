"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { UserRoleLevel } from "@repo/db/enums";

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
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useTRPC } from "~/trpc/react";

export function CreateEditUser() {
  const trpc = useTRPC();
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const { data: roles } = useSuspenseQuery(trpc.userRole.all.queryOptions());
  const t = useTranslations();
  return (
    <div className="grid grid-cols-1 items-start gap-4 p-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Information de l'utilisateurs</CardTitle>
          <CardDescription>Entrer les information utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-user-form" className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Nom complet</Label>
              <Input />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Label>Mot de passe</Label>
                <Input />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Confirmer mot de passe</Label>
                <Input />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button form="create-user-form">{t("submit")}</Button>
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
          <FieldGroup>
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
                            r.level == UserRoleLevel.LEVEL1
                              ? "destructive"
                              : r.level == UserRoleLevel.LEVEL2
                                ? "primary"
                                : r.level == UserRoleLevel.LEVEL3
                                  ? "info"
                                  : r.level == UserRoleLevel.LEVEL4
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
