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
    <div className="flex items-center justify-between gap-3 px-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{t("classroom_list")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("classroom_title_description")}
        </p>
      </div>
      <div className="ml-auto flex flex-row items-center gap-3">
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
            <Plus aria-hidden="true" />
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
              <PDFIcon />
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
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
