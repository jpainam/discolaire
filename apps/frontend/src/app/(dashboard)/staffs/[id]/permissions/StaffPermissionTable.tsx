/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
    <div className="grid grid-cols-1 items-start gap-4 pb-8 xl:grid-cols-2">
      {modules.map((mod, index) => {
        const perms = moduleMapPermission.get(mod.id);
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{mod.name}</CardTitle>
              <CardDescription>{mod.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 pt-1">
              {perms?.map((p, idx) => {
                //const staffperm = staffperms.get(p.resource);
                return (
                  <div
                    key={`${p.resource}-${idx}`}
                    className="flex-items flex justify-between rounded-lg border p-2"
                  >
                    <div className="flex flex-col gap-2 px-2">
                      <div className="text-xs">{p.name}</div>

                      <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                    <div>
                      <Select>
                        <SelectTrigger size="sm" className="w-[110px]">
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
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
