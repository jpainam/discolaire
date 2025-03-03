"use client";

import { Mail, MoreVertical } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

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
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";

export function StudentAssignmentHeader() {
  const { t } = useLocale();
  const [_, setTerm] = useQueryState("term", parseAsInteger);
  return (
    <div className="flex flex-row items-center gap-2 bg-secondary px-2 py-1">
      <Label>{t("assignments")}</Label>
      <TermSelector
        onChange={(val) => {
          void setTerm(val ? Number(val) : null);
        }}
        className="md:w-[250px]"
      />
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              {t("notify")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
