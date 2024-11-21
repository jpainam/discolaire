"use client";

import { useParams } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useRouter } from "~/hooks/use-router";
import { sidebarIcons } from "../sidebar-icons";

export function ReportCardHeader() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const [termId] = useQueryState("term", parseAsInteger);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const Icon = sidebarIcons.report_cards;
  return (
    <div className="grid flex-row items-center gap-4 border-b bg-muted/40 px-2 py-1 md:flex">
      {Icon && <Icon className="hidden h-6 w-6 md:block" />}
      <Label className="hidden md:block">{t("term")}</Label>
      <TermSelector
        className="md:w-[350px]"
        defaultValue={termId?.toString()}
        onChange={(val) => {
          router.push(`?` + createQueryString({ term: val }));
        }}
      />
      <div className="flex flex-row items-center gap-2 md:ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/report-cards?classroomId=${params.id}&termId=${termId}`,
                  "_blank",
                );
              }}
            >
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
