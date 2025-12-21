import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { getAppreciations } from "~/utils/appreciations";

export function ReportCardPerformance({
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
  const t = useTranslations();

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
            <TableCell className={cn(rowClassName)}>{t("Moy Min")}</TableCell>
            <TableCell>{isFinite(min) ? min.toFixed(2) : "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("Moy C")}</TableCell>
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
