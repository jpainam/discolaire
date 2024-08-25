import { Table, TableBody, TableCell, TableRow } from "@repo/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";
//import { StudentReportCard } from "~/types/report-card";
import { Check, HelpCircle } from "lucide-react";

import { getServerTranslations } from "~/app/i18n/server";
import { cn } from "~/lib/utils";

export async function ReportCardSummary({ reportCard }: { reportCard: any[] }) {
  const { t } = await getServerTranslations();
  const rowClassName = "border text-center text-sm";
  return (
    <div className="my-2">
      <Table className="border-y">
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold uppercase">
              {t("discipline")}
            </TableCell>
            <TableCell className="border">
              N<sup>o</sup> {t("absences")}
            </TableCell>
            <TableCell className={cn(rowClassName)}>16</TableCell>
            <TableCell>{t("justified_absences")}</TableCell>
            <TableCell className={cn(rowClassName)}>16</TableCell>
            <TableCell className="border">
              {t("unjustified_absences")}
            </TableCell>
            <TableCell className={cn(rowClassName)}>0</TableCell>
            <TableCell className="border">{t("lates")}</TableCell>
            <TableCell className={cn(rowClassName)}>0</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border-y font-semibold uppercase">
              {t("mention")}
            </TableCell>
            <TableCell className="border">{t("warning")}</TableCell>
            <TableCell className={cn(rowClassName)}>16</TableCell>
            <TableCell className={"border"}>{t("honor")}</TableCell>
            <TableCell className={cn(rowClassName)}>
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4" />
              </div>
            </TableCell>
            <TableCell className={"border"}>{t("encouragements")}</TableCell>
            <TableCell></TableCell>
            <TableCell className="border">{t("congratulations")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left font-semibold uppercase">
              <div className="flex flex-row items-center gap-3">
                {t("performance")}
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-5 w-5 text-blue-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to library</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
            <TableCell className={"border"}>{t("Moy.Max")}</TableCell>
            <TableCell className={cn(rowClassName)}>-</TableCell>
            <TableCell className="border">{t("Moy.Min")}</TableCell>
            <TableCell className={cn(rowClassName)}>-</TableCell>
            <TableCell>{t("Moy. Classe")}</TableCell>
            <TableCell className={cn(rowClassName)}>-</TableCell>
            <TableCell className={"border"}>% {t("success")}</TableCell>
            <TableCell className="border-y text-center">-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
