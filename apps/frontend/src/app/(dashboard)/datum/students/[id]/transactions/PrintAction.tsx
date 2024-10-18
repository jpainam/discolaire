"use client";

import { MoreVertical } from "lucide-react";

import { useLocale } from "@repo/hooks/use-locale";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";

export function PrintAction() {
  const { t } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size={"icon"} variant={"outline"}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
  );
}
