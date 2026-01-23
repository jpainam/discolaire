"use client";

import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { RoleLevel } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTRPC } from "~/trpc/react";

export function StaffPermissionTable({ staffId }: { staffId: string }) {
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
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
      <div className="col-span-2 grid items-start gap-2 xl:grid-cols-2">
        {[
          modules.slice(0, modules.length / 2),
          modules.slice(modules.length / 2),
        ].map((mmod, iindex) => {
          return (
            <Accordion
              defaultValue={mmod.slice(0, 3).map((m) => m.id)}
              type="multiple"
              key={iindex}
            >
              {mmod.map((mod, index) => {
                const perms = moduleMapPermission.get(mod.id);
                return (
                  <AccordionItem key={index} value={mod.id}>
                    <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
                      {mod.name}
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-1 gap-2 pt-1">
                      {perms?.map((p, idx) => {
                        const staffperm = staffperms.get(p.resource);
                        return (
                          <Card
                            key={`${p.resource}-${idx}`}
                            className="m-0 gap-0 px-0 py-1"
                          >
                            <CardHeader className="px-2">
                              <CardTitle className="text-xs">
                                {p.name}
                              </CardTitle>
                              <CardAction>
                                <Select>
                                  <SelectTrigger
                                    size="sm"
                                    className="w-[110px]"
                                  >
                                    <SelectValue placeholder="Autorisation" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="allow">
                                      <CheckIcon className="text-green-600" />
                                      {t("Allow")}
                                    </SelectItem>
                                    <SelectItem value="deny">
                                      <XIcon className="text-red-600" />
                                      {t("Deny")}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </CardAction>
                              <CardDescription className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    p.type == "ACTION"
                                      ? "success"
                                      : p.type == "MENU"
                                        ? "primary"
                                        : "destructive"
                                  }
                                  size={"xs"}
                                  appearance={"light"}
                                >
                                  {p.type}
                                </Badge>
                                <Badge
                                  size={"xs"}
                                  variant={"info"}
                                  appearance={"light"}
                                >
                                  {p.resource}
                                </Badge>
                                <Badge
                                  size={"xs"}
                                  variant={"warning"}
                                  appearance={"light"}
                                >
                                  Via rôle
                                </Badge>
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          );
        })}
      </div>
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
