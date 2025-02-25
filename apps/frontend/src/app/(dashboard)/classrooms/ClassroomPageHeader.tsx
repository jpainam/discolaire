"use client";

import { MoreVertical, Plus } from "lucide-react";

import { useSheet } from "@repo/hooks/use-sheet";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { endpointReports } from "~/configs/endpoints";
import { useCheckPermissions } from "~/hooks/use-permissions";

export function ClassroomPageHeader() {
  const { t } = useLocale();
  const { openSheet } = useSheet();

  const canCreateClassroom = useCheckPermissions(
    PermissionAction.CREATE,
    "classroom:details"
  );

  return (
    <div className="flex flex-row items-center gap-2 border-b px-2 pb-1">
      <Label>{t("classrooms")}</Label>

      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateClassroom && (
          <Button
            size={"sm"}
            disabled={!canCreateClassroom}
            onClick={() => {
              openSheet({
                className: "w-[700px]",
                title: t("create"),
                view: <CreateEditClassroom />,
              });
            }}
          >
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {t("new")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `${endpointReports.classroom_list}?format=pdf`,
                  "_blank"
                );
              }}
            >
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `${endpointReports.classroom_list}?format=csv`,
                  "_blank"
                );
              }}
            >
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
