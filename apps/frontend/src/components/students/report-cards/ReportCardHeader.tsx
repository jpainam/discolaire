"use client";

import { MailIcon, MoreVertical } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

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

import type { RouterOutputs } from "@repo/api";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { TrimestreSelector } from "~/components/shared/selects/TrimestreSelector";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { sidebarIcons } from "../sidebar-icons";

export function ReportCardHeader({
  classroom,
}: {
  classroom: NonNullable<RouterOutputs["student"]["classroom"]>;
}) {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const Icon = sidebarIcons.report_cards;
  const canPrintReportCard = useCheckPermission(
    "reportcard",
    PermissionAction.CREATE
  );
  return (
    <div className="grid md:flex flex-row items-center gap-2 border-b bg-secondary px-4 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("term")}</Label>
      <TermSelector
        className="w-[300px]"
        defaultValue={searchParams.get("term")}
        onChange={(val) => {
          router.push(`/students/${params.id}/report-cards?term=${val}`);
        }}
      />
      <TrimestreSelector
        className="w-[300px]"
        onChange={(val) => {
          const url =
            `/students/${params.id}/report-cards/trimestres?` +
            createQueryString({
              trimestreId: val,
              classroomId: classroom.id,
              studentId: params.id,
              format: "pdf",
            });
          router.push(url);
        }}
      />
      {canPrintReportCard && (
        <div className="ml-auto flex flex-row items-center gap-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <MailIcon />
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
      )}
    </div>
  );
}
