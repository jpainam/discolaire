import { getServerTranslations } from "@repo/i18n/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

export async function GradeSheetStats({
  gradeSheetId,
  className,
}: {
  gradeSheetId: number;
  className?: string;
}) {
  const { t } = await getServerTranslations();
  const successRate = await api.gradeSheet.successRate(gradeSheetId);

  return (
    <div className={cn("p-1", className)}>
      <Table className="items-center border-none">
        <TableHeader>
          <TableRow className="border">
            <TableHead align="center" className="border" rowSpan={2}>
              {t("number_of_avg")}
            </TableHead>
            <TableHead align="center" className="border" colSpan={2}>
              {t("success_rate")}
            </TableHead>
            <TableHead align="center" className="border" rowSpan={2}>
              {t("total_success_rate")}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead align="center" className="border">
              {t("males")}
            </TableHead>
            <TableHead>{t("females")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell align="center" className="border">
              {successRate.numberOfAvg}
            </TableCell>
            <TableCell align="center" className="border">
              {(
                (successRate.numberOfAvgMale * 100) /
                (successRate.numberOfMale || 1e-9)
              ).toFixed(2)}
              %
            </TableCell>
            <TableCell align="center" className="border">
              {(
                (successRate.numberOfAvgFemale * 100) /
                (successRate.numberOfFemale || 1e-9)
              ).toFixed(2)}
              %
            </TableCell>
            <TableCell align="center" className="border">
              {(
                (successRate.numberOfAvg * 100) /
                (successRate.numberOfGrade || 1e-9)
              ).toFixed(2)}
              %
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
