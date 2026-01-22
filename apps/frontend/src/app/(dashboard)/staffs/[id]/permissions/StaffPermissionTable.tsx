"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

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

export function StaffPermissionTable() {
  const trpc = useTRPC();
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const { data: roles } = useSuspenseQuery(trpc.role.all.queryOptions());
  return (
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
  );
}
