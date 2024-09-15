"use client";

import { MoreVertical, PlusIcon } from "lucide-react";

import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { sidebarIcons } from "../sidebar-icons";
import { CreateEditSubject } from "./CreateEditSubject";
import { SubjectStats } from "./SubjectStats";

export function SubjectHeader() {
  const Icon = sidebarIcons.subjects;
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const canAddClassroomSubject = useCheckPermissions(
    PermissionAction.CREATE,
    "classroom:subject",
  );

  return (
    <div className="flex w-full flex-row items-center gap-2 border-b bg-muted px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("subjects")}</Label>
      <SubjectStats />
      <div className="ml-auto flex flex-row items-center gap-1">
        {canAddClassroomSubject && (
          <Button
            size={"sm"}
            onClick={() => {
              openSheet({
                title: (
                  <p className="px-2">
                    {t("create")}-{t("subject")}
                  </p>
                ),
                view: <CreateEditSubject />,
              });
            }}
            variant={"default"}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
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
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
