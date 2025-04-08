"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Captions, MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useLocale } from "~/i18n";
export function StudentGradesheetHeader() {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();

  return (
    <div className="flex border-b flex-row items-center gap-1 px-4 py-1">
      <Captions className="hidden md:block w-4 h-4" />
      <Label className="hidden md:block">{t("transcripts")}</Label>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="size-8">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/${params.id}/transcripts?format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/${params.id}/transcripts?format=csv`,
                  "_blank",
                );
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
