import { getTranslations } from "next-intl/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

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
  const t = await getTranslations();

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
            <TableCell className={cn(rowClassName)}>{t("Moy Max")}</TableCell>
            <TableCell className="min-w-[60px]">
              {isFinite(max) ? max.toFixed(2) : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("Moy.Min")}</TableCell>
            <TableCell>{isFinite(min) ? min.toFixed(2) : "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("Moy.Class")}</TableCell>
            <TableCell>{isFinite(avg) ? avg.toFixed(2) : "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("success_rate")}
            </TableCell>
            <TableCell>
              {((isFinite(successRate) ? successRate : 0) * 100).toFixed(2)}%
            </TableCell>
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
