"use client";

import { BookText, MailIcon, MoreVertical } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

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

import { useQueryStates } from "nuqs";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { TrimestreSelector } from "~/components/shared/selects/TrimestreSelector";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { reportcardSearchParamsSchema } from "~/utils/search-params";

export function ReportCardHeader({ classroomId }: { classroomId: string }) {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const pathname = usePathname();

  const canPrintReportCard = useCheckPermission(
    "reportcard",
    PermissionAction.CREATE,
  );

  const [searchParams] = useQueryStates(reportcardSearchParamsSchema);
  const { termId, trimestreId } = searchParams;
  return (
    <div className="grid md:flex flex-row items-center gap-2 border-b bg-muted px-4 py-1 text-muted-foreground">
      <div className="flex flex-row items-center gap-1">
        <BookText className="h-4 w-4" />
        <Label>{t("reportcards")}</Label>
      </div>
      <div className="grid grid-cols-2 md:flex flex-row items-center gap-2">
        <TermSelector
          className="md:w-[300px]"
          defaultValue={termId ? `${termId}` : undefined}
          onChange={(val) => {
            router.push(`/students/${params.id}/reportcards?termId=${val}`);
          }}
        />
        <TrimestreSelector
          className="md:w-[300px]"
          defaultValue={trimestreId ?? undefined}
          onChange={(val) => {
            if (val == "ann") {
              router.push(`/students/${params.id}/reportcards/annual`);
            } else {
              const url =
                `/students/${params.id}/reportcards/trimestres?` +
                createQueryString({
                  trimestreId: val,
                  classroomId: classroomId,
                  studentId: params.id,
                  format: "pdf",
                });
              router.push(url);
            }
          }}
        />
      </div>
      {canPrintReportCard && (
        <div className="ml-auto flex flex-row items-center gap-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} className="size-8" variant={"outline"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={!termId && !trimestreId}>
                <MailIcon />
                {t("notify_parents")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!termId && !trimestreId}
                onSelect={() => {
                  let url = `/api/pdfs/reportcards/ipbw/?studentId=${params.id}&termId=${termId}`;
                  if (pathname.includes("/trimestres") && trimestreId) {
                    url = `/api/pdfs/reportcards/ipbw/trimestres/?studentId=${params.id}&trimestreId=${trimestreId}`;
                  }
                  window.open(url, "_blank");
                }}
              >
                <PDFIcon />
                {t("pdf_export")}
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!termId && !trimestreId}>
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
