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

export async function ReportCardPerformance({ id }: { id: string }) {
  console.log(id);
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
            <TableCell className="w-[60px]"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("Moy.Min")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("Moy.Class")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("success_rate")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("mention")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
