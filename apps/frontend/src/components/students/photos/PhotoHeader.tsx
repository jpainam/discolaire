"use client";

import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { useLocale } from "~/hooks/use-locale";
import { sidebarIcons } from "../sidebar-icons";

export function PhotoHeader() {
  const { t } = useLocale();
  const Icon = sidebarIcons["photos"];
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary p-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("photos")}</Label>
      <div className="ml-auto">
        <Button variant={"outline"} size={"sm"}>
          Upload
        </Button>
      </div>
    </div>
  );
}
