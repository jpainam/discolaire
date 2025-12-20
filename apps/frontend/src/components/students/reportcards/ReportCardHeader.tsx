"use client";

import { useParams, usePathname } from "next/navigation";
import { BookText, MailIcon, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

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
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { reportcardSearchParamsSchema } from "~/utils/search-params";

export function ReportCardHeader() {
  const t = useTranslations();

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
    <div className="bg-muted text-muted-foreground grid flex-row items-center gap-2 border-b px-4 py-1 md:flex">
      <div className="flex flex-row items-center gap-2">
        <BookText className="h-4 w-4" />
        <Label>{t("reportcards")}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Label>{t("terms")}</Label>
        <TermSelector
          className="md:w-[300px]"
          defaultValue={termId}
          onChange={(val) => {
            router.push(`/students/${params.id}/reportcards?termId=${val}`);
          }}
        />
      </div>

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
            {canPrintReportCard && (
              <>
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
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
