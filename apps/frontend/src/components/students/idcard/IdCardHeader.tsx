"use client";

import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useLocale } from "~/i18n";
import { sidebarIcons } from "../sidebar-icons";

export function IdCardHeader() {
  const { t } = useLocale();
  const Icon = sidebarIcons.id_card;
  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-1 border-b px-4 py-1">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("id_card")}</Label>
      <div className="ml-auto">
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
                toast.warning("Not implemented yet");
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
