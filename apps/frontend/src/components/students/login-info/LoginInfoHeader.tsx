"use client";

import { AtSign, MoreVertical, Printer } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import { sidebarIcons } from "../sidebar-icons";

export function LoginInfoHeader() {
  const { t } = useLocale();
  const Icon = sidebarIcons.login_info;
  return (
    <div className="flex flex-row items-center bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <Label>{t("login_info")}</Label>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex flex-row items-center gap-2">
              <Printer className="h-4 w-4" />
              <span>{t("print")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-row items-center gap-2">
              <AtSign className="h-4 w-4" />
              <span> {t("send_email")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
