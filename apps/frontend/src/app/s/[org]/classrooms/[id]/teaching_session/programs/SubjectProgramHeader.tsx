"use client";

import { FileTextIcon, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";

export function SubjectProgramHeader({
  subject,
}: {
  subject: RouterOutputs["subject"]["get"];
}) {
  const t = useTranslations();

  return (
    <div className="bg-muted/50 flex flex-row items-center justify-between gap-2 border-b px-4 py-1">
      <div className="flex items-center gap-1">
        <FileTextIcon className="h-4 w-4" />
        <Label>{t("programs")}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Label>Cours: {subject.course.name}</Label>
        <Label>Prof. {subject.teacher?.lastName}</Label>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} className="size-7" variant={"outline"}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              window.open(
                `/api/pdfs/classroom/${subject.classroomId}/subjects/${subject.id}?format=pdf&doc=program`,
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
                `/api/pdfs/classroom/${subject.classroomId}/subjects/${subject.id}?format=csv&doc=program`,
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
  );
}
