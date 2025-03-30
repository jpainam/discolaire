"use client";

import { MailIcon, MoreVertical } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import PDFIcon from "~/components/icons/pdf-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { sidebarIcons } from "../sidebar-icons";

export function LoginInfoHeader() {
  const { t } = useLocale();
  const Icon = sidebarIcons.login_info;
  return (
    <div className="flex flex-row gap-2 items-center bg-secondary px-4 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("login_info")}</Label>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuItem>
              <PDFIcon className="h-4 w-4" />
              <span>{t("pdf_export")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MailIcon className="h-4 w-4" />
              <span> {t("send_email")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
