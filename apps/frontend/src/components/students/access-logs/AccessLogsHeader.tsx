"use client";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { sidebarIcons } from "../sidebar-icons";

export function AccessLogsHeader() {
  const { t } = useLocale();
  const Icon = sidebarIcons["access_logs"];
  return (
    <div className="flex flex-row items-center bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      <Label>{t("access_logs")}</Label>
      <div className="ml-auto flex flex-row">
        <Button variant={"ghost"} size={"icon"}>
          <PDFIcon className="h-5 w-5" />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <XMLIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
