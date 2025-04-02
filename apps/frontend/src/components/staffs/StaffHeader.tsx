"use client";

import { MoreVertical, Plus } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import type { RouterOutputs } from "@repo/api";
import { Label } from "@repo/ui/components/label";
import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { breadcrumbAtom } from "~/lib/atoms";
import { getFullName } from "~/utils";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { DropdownHelp } from "../shared/DropdownHelp";
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

  const canCreateStaff = useCheckPermission("staff", PermissionAction.CREATE);

  const router = useRouter();
  const { openSheet } = useSheet();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    const staff = staffs.find((c) => c.id === params.id);
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("staffs"), url: "/staffs" },
    ];
    if (staff) {
      breads.push({ name: getFullName(staff), url: `/staffs/${staff.id}` });
    }
    setBreadcrumbs(breads);
  }, [staffs, params.id, setBreadcrumbs, t]);

  return (
    <div className="grid lg:flex flex-row gap-4 items-center justify-between py-1 px-4">
      <div className="flex  w-full flex-row items-center gap-2">
        <Label className="hidden md:block">{t("staffs")}</Label>
        <StaffSelector
          className="w-full lg:w-1/2 2xl:w-[350px]"
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
            <DropdownHelp />
            <DropdownMenuSeparator />
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
