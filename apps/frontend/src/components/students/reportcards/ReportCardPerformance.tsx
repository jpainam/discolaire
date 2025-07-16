import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { getServerTranslations } from "~/i18n/server";

import { cn } from "~/lib/utils";
import { getAppreciations } from "~/utils/appreciations";

export async function ReportCardPerformance({
  max,
  min,
  avg,
  successRate,
}: {
  max: number;
  min: number;
  successRate: number;
  avg: number;
}) {
  const { t } = await getServerTranslations();

  const rowClassName = "border-r text-sm";
  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold" colSpan={2}>
              {t("performance")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("Moy.Max")}</TableCell>
            <TableCell className="min-w-[60px]">{max.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("Moy.Min")}</TableCell>
            <TableCell>{min.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("Moy.Class")}</TableCell>
            <TableCell>{avg.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("success_rate")}
            </TableCell>
            <TableCell>{(successRate * 100).toFixed(2)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("mention")}</TableCell>
            <TableCell>{getAppreciations(avg)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
