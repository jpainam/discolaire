"use client";

import { useParams } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { useRouter } from "~/hooks/use-router";

export function SubjectProgramHeader() {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  return (
    <div className="bg-muted/50 flex flex-row items-center gap-2 border-b px-4 py-1">
      <Label>{t("programs")}</Label>
      <SubjectSelector
        className="w-96"
        onChange={(val) => {
          router.push(`./${val}`);
        }}
        classroomId={params.id}
      />
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"}>
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
