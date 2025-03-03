"use client";

import { MoreVertical, Plus } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { sidebarIcons } from "../sidebar-icons";
import { CreateEditFee } from "./CreateEditFee";

export function ClassroomFeeHeader() {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const { openModal } = useModal();
  const canCreateClassroomFee = useCheckPermissions(
    PermissionAction.CREATE,
    "classroom:fee",
    {
      id: params.id,
    }
  );
  const Icon = sidebarIcons.fees;
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-4 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("fees")}</Label>
      <div className="ml-auto flex flex-row gap-2 items-center">
        {canCreateClassroomFee && (
          <Button
            onClick={() => {
              openModal({
                title: <div>{t("add")}</div>,
                className: "w-[500px]",
                view: <CreateEditFee />,
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
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                console.log("PDF");
              }}
            >
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
