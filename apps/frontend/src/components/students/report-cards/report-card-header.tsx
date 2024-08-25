"use client";

import PDFIcon from "@/components/icons/pdf-solid";
import XMLIcon from "@/components/icons/xml-solid";
import { TermSelector } from "@/components/shared/selects/TermSelector";
import { routes } from "@/configs/routes";
import { useCreateQueryString } from "@/hooks/create-query-string";
import { useLocale } from "@/hooks/use-locale";
import { useRouter } from "@/hooks/use-router";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";
import { MoreVertical } from "lucide-react";

export function ReportCardHeader() {
  const router = useRouter();
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  return (
    <div className="flex flex-row items-center gap-4 border-b bg-muted p-2">
      <Label className="w-[100px]">{t("periods")}</Label>
      <TermSelector
        className="h-8 w-[300px]"
        onChange={(val) => {
          router.push("?" + createQueryString({ termId: val }));
        }}
      />
      <div>Effectif:</div>
      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                router.push(routes.reports.index);
              }}
              className="flex flex-row gap-2"
            >
              <PDFIcon className="h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(routes.reports.index);
              }}
              className="flex flex-row gap-2"
            >
              <XMLIcon className="h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
