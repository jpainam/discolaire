"use client";

import { MoreVertical, Trash2 } from "lucide-react";

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

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { sidebarIcons } from "../sidebar-icons";

export function AccessLogsHeader({ userId }: { userId: string }) {
  const { t } = useLocale();
  const Icon = sidebarIcons.access_logs;
  const canCreateUser = useCheckPermission("user", PermissionAction.CREATE);
  return (
    <div className="flex flex-row gap-2 border-b items-center bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("access_logs")}</Label>
      <div className="ml-auto flex flex-row">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/accesslogs?format=pdf?userId=${userId}`,
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
                  `/api/accesslogs?format=csv?userId=${userId}`,
                  "_blank"
                );
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>

            {canCreateUser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 />
                  {t("clear_all")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
