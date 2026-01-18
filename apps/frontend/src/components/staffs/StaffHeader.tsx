"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Download, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { CreateEditStaff } from "./CreateEditStaff";
import { StaffEffectif } from "./StaffEffectif";

export function StaffHeader() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: staffs } = useSuspenseQuery(trpc.staff.all.queryOptions());

  const canCreateStaff = useCheckPermission("staff", "create");

  const { openSheet } = useSheet();

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
            >
              <Download className="h-4 w-4" />
              {t("Export")}
            </Button>
          )}
          {canCreateStaff && (
            <Button
              onClick={() => {
                openSheet({
                  title: t("add"),
                  description: t("staff"),
                  view: <CreateEditStaff formId="create-edit-staff-form" />,
                  formId: "create-edit-staff-form",
                });
              }}
            >
              <Plus />
              {t("add")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
