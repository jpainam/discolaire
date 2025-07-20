"use client";

import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Download, Plus } from "lucide-react";

import { Button } from "@repo/ui/components/button";

import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { breadcrumbAtom } from "~/lib/atoms";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { CreateEditStaff } from "./CreateEditStaff";
import { StaffEffectif } from "./StaffEffectif";

export function StaffHeader() {
  const { t } = useLocale();
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
    <>
      <header className="bg-background border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{t("Staff Management")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("staff_management_description")}
            </p>
          </div>
          <div className="flex items-center gap-3">
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
      </header>
    </>
  );
}
