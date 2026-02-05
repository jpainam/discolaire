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

export function StaffHeader() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: staffs } = useSuspenseQuery(trpc.staff.all.queryOptions());

  const canCreateStaff = useCheckPermission("staff.create");

  const { openSheet } = useSheet();
  const females = staffs.filter((staff) => staff.gender == "female").length;
  const total = staffs.length;
  const males = total - females;

  const COLORS = ["#6741D9", "#E0C6FD", "#FFBC75", "#FF7272"];

  return (
    <div className="flex items-center justify-between p-2 px-4 lg:flex-row">
      <Label className="hidden md:flex">{t("staffs")}</Label>
      <div className="grid grid-cols-1 items-center justify-between md:flex">
        <div className="grid grid-cols-1 items-center gap-3 md:flex">
          <div className="grid grid-cols-2 flex-row items-center gap-4 text-sm md:flex">
            <Detail color={COLORS[0]} value={total} text={t("total")} />
            <Detail color={COLORS[2]} value={males} text={t("male")} />
            <Detail color={COLORS[3]} value={females} text={t("female")} />
          </div>
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

function Detail({
  color,
  value,
  text,
}: {
  color?: string;
  value: number;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-start gap-1">
        <span
          style={{ background: color }}
          className="block h-2.5 w-2.5 rounded"
        />
        <Label>{text}</Label>
      </div>
      <span
        style={{ borderColor: color }}
        className="rounded-full border-2 px-2 py-0.5 text-xs font-bold"
      >
        {value}
      </span>
    </div>
  );
}
