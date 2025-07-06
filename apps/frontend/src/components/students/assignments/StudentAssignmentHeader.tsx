"use client";

import { Mail, MoreVertical, NotebookPen } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import { useSearchParams } from "next/navigation";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";

export function StudentAssignmentHeader() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const term = searchParams.get("term");
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  return (
    <div className="flex flex-row items-center gap-2 bg-muted text-muted-foreground px-2 py-1">
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
            <Button variant={"outline"} className="size-8" size={"icon"}>
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
