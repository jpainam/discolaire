"use client";

import { useParams } from "next/navigation";
import { MoreVertical, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { sidebarIcons } from "../sidebar-icons";
import { CreateEditFee } from "./CreateEditFee";

export function ClassroomFeeHeader() {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const { openModal } = useModal();
  const canCreateClassroomFee = useCheckPermission(
    "fee",
    PermissionAction.CREATE,
  );
  const Icon = sidebarIcons.fees;
  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-2 border-b px-4 py-1">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("fees")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateClassroomFee && (
          <Button
            onClick={() => {
              openModal({
                title: t("add"),
                view: <CreateEditFee classroomId={params.id} />,
              });
            }}
            size={"sm"}
          >
            <Plus />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/classroom/${params.id}/fees?format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/classroom/${params.id}/fees?format=csv`,
                  "_blank",
                );
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
