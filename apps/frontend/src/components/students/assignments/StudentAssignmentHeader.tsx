"use client";

import { Mail, MoreVertical, NotebookPen } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";

export function StudentAssignmentHeader() {
  const t = useTranslations();
  const [termId, setTermId] = useQueryState("termId", parseAsString);

  return (
    <div className="bg-muted/50 grid flex-row items-center gap-2 border-b px-2 py-1 md:flex">
      <NotebookPen className="hidden h-4 w-4 md:flex" />
      <Label>{t("assignments")}</Label>
      <TermSelector
        defaultValue={termId ?? undefined}
        onChange={(val) => {
          void setTermId(val);
        }}
        className="w-full xl:w-1/3"
      />
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Mail />
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
