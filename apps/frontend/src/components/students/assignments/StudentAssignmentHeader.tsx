"use client";

import { useSearchParams } from "next/navigation";
import { Mail, MoreVertical, NotebookPen } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";

export function StudentAssignmentHeader() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const term = searchParams.get("term");
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  return (
    <div className="bg-muted/50 flex flex-row items-center gap-2 px-2 py-1">
      <NotebookPen className="h-4 w-4" />
      <Label>{t("assignments")}</Label>
      <TermSelector
        defaultValue={term}
        onChange={(val) => {
          router.push(
            `?${createQueryString({
              term: val,
            })}`,
          );
        }}
        className="md:w-[250px]"
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
