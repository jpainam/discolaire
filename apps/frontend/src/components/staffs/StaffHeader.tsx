"use client";

import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Download, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { breadcrumbAtom } from "~/lib/atoms";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { CreateEditStaff } from "./CreateEditStaff";
import { StaffEffectif } from "./StaffEffectif";

export function StaffHeader() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: staffs } = useSuspenseQuery(trpc.staff.all.queryOptions());

  const canCreateStaff = useCheckPermission("staff", PermissionAction.CREATE);

  const { openSheet } = useSheet();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("staffs"), url: "/staffs" },
    ];

    setBreadcrumbs(breads);
  }, [staffs, setBreadcrumbs, t]);

  return (
    <div className="flex items-center justify-between p-2 px-4 lg:flex-row">
      <Label>{t("staffs")}</Label>
      <div className="grid grid-cols-1 items-center justify-between md:flex">
        <div className="grid grid-cols-1 items-center gap-3 md:flex">
          <StaffEffectif staffs={staffs} />
          {canCreateStaff && (
            <Button
              onClick={() => {
                window.open(`/api/pdfs/staff?format=csv`, "_blank");
              }}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4" />
              {t("Export")}
            </Button>
          )}
          {canCreateStaff && (
            <Button
              onClick={() => {
                openSheet({
                  title: t("create_staff"),
                  view: <CreateEditStaff />,
                });
              }}
              size="sm"
            >
              <Plus />
              {t("Add staff")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
