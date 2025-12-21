"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Badge } from "~/components/base-badge";
import PDFIcon from "~/components/icons/pdf-solid";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { getAppreciations } from "~/utils/appreciations";

export function ReportCardActionHeader({
  title,
  maxAvg,
  minAvg,
  avg,
  successRate,
  classroomSize,
  pdfHref,
}: {
  title: string;
  maxAvg: number;
  minAvg: number;
  avg: number;
  successRate: number;
  classroomSize: number;
  pdfHref: string;
}) {
  const t = useTranslations();

  const canCreateReportCard = useCheckPermission(
    "reportcard",
    PermissionAction.CREATE,
  );

  return (
    <div className="bg-muted/50 grid flex-row items-center gap-4 border-y px-4 py-1 md:flex">
      <Label className="font-bold uppercase">{title}</Label>
      <Badge variant={"success"} appearance={"light"}>
        {t("Moy Max")} : {isFinite(maxAvg) ? maxAvg.toFixed(2) : "-"}
      </Badge>
      <Badge variant={"destructive"} appearance={"light"}>
        {t("Moy Min")} : {isFinite(minAvg) ? minAvg.toFixed(2) : "-"}
      </Badge>
      <Badge variant={"info"} appearance={"light"}>
        {t("Moy C")} : {isFinite(avg) ? avg.toFixed(2) : "-"}
      </Badge>

      <Badge variant={"warning"} appearance={"light"}>
        {t("success_rate")} :{" "}
        {isFinite(successRate) ? (successRate * 100).toFixed(2) + "%" : "-"}
      </Badge>
      <Badge variant={"primary"} appearance={"light"}>
        {t("effectif")} : {classroomSize}
      </Badge>
      <Badge variant={"secondary"} appearance={"light"}>
        {t("appreciation")} : {getAppreciations(avg)}
      </Badge>
      <div className="ml-auto">
        {canCreateReportCard && (
          <Link
            className="ml-auto"
            //href={`/api/pdfs/reportcards/ipbw?classroomId=${params.id}&termId=${termId}`}
            href={pdfHref}
            target="_blank"
          >
            <Button variant={"secondary"} size={"sm"}>
              <PDFIcon />
              {t("pdf_export")}
            </Button>
          </Link>
        )}

        {/* <ButtonGroup>
          <Button variant="outline">
            <PrinterIcon />
            {t("print")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More Options">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onSelect={() => {
                  router.push(
                    `/api/pdfs/reportcards/ipbw?classroomId=${params.id}&termId=${termId}`,
                  );
                }}
              ></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup> */}
      </div>
    </div>
  );
}
