/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
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

export function StaffRoleTable({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const { data: roles } = useSuspenseQuery(trpc.role.all.queryOptions());
  const { data: modules } = useSuspenseQuery(trpc.module.all.queryOptions());
  const { data: staffPermissions } = useSuspenseQuery(
    trpc.staff.permissions.queryOptions(staffId),
  );
  const t = useTranslations();
  const { data: permissions } = useSuspenseQuery(
    trpc.permission.all.queryOptions(),
  );
  const { mmp: moduleMapPermission, staffperms } = useMemo(() => {
    const mmp = new Map<string, RouterOutputs["permission"]["all"]>();
    const resourceToModuleId = new Map<string, string>();
    modules.forEach((mod) => {
      mmp.set(mod.id, []);
      mod.permissions.forEach((permission) => {
        resourceToModuleId.set(permission.resource, mod.id);
      });
    });
    permissions.forEach((permission) => {
      const moduleId = resourceToModuleId.get(permission.resource);
      if (!moduleId) {
        return;
      }
      const modulePermissions = mmp.get(moduleId);
      if (modulePermissions) {
        modulePermissions.push(permission);
      } else {
        mmp.set(moduleId, [permission]);
      }
    });
    const staffperms = new Map<
      string,
      RouterOutputs["staff"]["permissions"][number]
    >();
    staffPermissions.forEach((sps) => {
      staffperms.set(sps.resource, sps);
    });
    return { mmp, staffperms };
  }, [modules, permissions, staffPermissions]);
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
        <FieldGroup className="grid grid-cols-1 gap-2 lg:grid-cols-2">
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
