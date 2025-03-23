"use client";

import { MoreVertical } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { TrimestreSelector } from "~/components/shared/selects/TrimestreSelector";
import { useRouter } from "~/hooks/use-router";
import { sidebarIcons } from "../sidebar-icons";

export function ReportCardHeader() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  const [termId] = useQueryState("term", parseAsInteger);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const Icon = sidebarIcons.reportcards;
  return (
    <div className="grid flex-row items-center gap-4 border-b bg-muted/40 px-4 py-1 md:flex">
      {Icon && <Icon className="hidden h-6 w-6 md:block" />}
      <Label className="hidden md:block">{t("term")}</Label>
      <TermSelector
        className="md:w-[350px]"
        defaultValue={termId?.toString()}
        onChange={(val) => {
          router.push(
            `/classrooms/${params.id}/reportcards?` +
              createQueryString({ term: val, trimestreId: undefined }),
          );
        }}
      />
      <TrimestreSelector
        className="w-[300px]"
        defaultValue={searchParams.get("trimestreId") ?? undefined}
        onChange={(val) => {
          const url =
            `/classrooms/${params.id}/reportcards/trimestres?` +
            createQueryString({
              trimestreId: val,
              classroomId: params.id,
              format: "pdf",
            });
          router.push(url);
        }}
      />
      <div className="flex flex-row items-center gap-2 md:ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/reportcards/ipbw?classroomId=${params.id}&termId=${termId}`,
                  "_blank",
                );
              }}
            >
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
