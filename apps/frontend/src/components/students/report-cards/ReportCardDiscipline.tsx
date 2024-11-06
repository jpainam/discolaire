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

export async function ReportCardDiscipline({ id }: { id: string }) {
  console.log(id);
  const { t } = await getServerTranslations();
  const rowClassName = "border-r text-sm";
  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold" colSpan={2}>
              {t("discipline")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("total_absences")}
            </TableCell>
            <TableCell className="min-w-[60px]"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("justified")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("non_justified")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("late")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("consigne")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
