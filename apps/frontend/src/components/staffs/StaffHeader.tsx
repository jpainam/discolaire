"use client";

import { MoreVertical, Plus } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import type { RouterOutputs } from "@repo/api";
import { Label } from "@repo/ui/components/label";
import { useParams } from "next/navigation";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { useRouter } from "~/hooks/use-router";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { StaffSelector } from "../shared/selects/StaffSelector";
import { CreateEditStaff } from "./CreateEditStaff";
import { StaffEffectif } from "./StaffEffectif";

export function StaffHeader({
  staffs,
}: {
  staffs: RouterOutputs["staff"]["all"];
}) {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();

  const canCreateStaff = useCheckPermissions(
    PermissionAction.CREATE,
    "staff:profile"
  );

  const router = useRouter();
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row items-center justify-between py-1 px-4">
      <div className="flex flex-row items-center gap-2">
        <Label>{t("staffs")}</Label>
        <StaffSelector
          className="w-[350px]"
          onChange={(val) => {
            router.push(`/staffs/${val}`);
          }}
        />
      </div>
      {!params.id && <StaffEffectif staffs={staffs} />}

      <div className="flex flex-row items-center gap-2">
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
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="size-8" variant="outline">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
