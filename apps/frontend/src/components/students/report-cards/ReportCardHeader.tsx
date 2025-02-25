"use client";

import { MailIcon, MoreVertical } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
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
import { useRouter } from "~/hooks/use-router";
import { sidebarIcons } from "../sidebar-icons";

export function ReportCardHeader() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const Icon = sidebarIcons.report_cards;
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("term")}</Label>
      <TermSelector
        className="w-[300px]"
        defaultValue={searchParams.get("term")}
        onChange={(val) => {
          router.push(`?` + createQueryString({ term: val }));
        }}
      />
      <div className="ml-auto flex flex-row items-center gap-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <MailIcon className="mr-2 h-4 w-4" />
              {t("notify_parents")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/report-cards/ipbw/?studentId=${params.id}&termId=${searchParams.get("term")}`,
                  "_blank"
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
