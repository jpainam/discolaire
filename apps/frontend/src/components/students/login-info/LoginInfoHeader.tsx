"use client";

import { useLocale } from "@/hooks/use-locale";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";
import { AtSign, MoreVertical, Printer } from "lucide-react";

import { sidebarIcons } from "../sidebar-icons";

export function LoginInfoHeader() {
  const { t } = useLocale();
  const Icon = sidebarIcons["login_info"];
  return (
    <div className="flex flex-row items-center bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="mr-2 h-6 w-6" />}
      <Label>{t("login_info")}</Label>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
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
