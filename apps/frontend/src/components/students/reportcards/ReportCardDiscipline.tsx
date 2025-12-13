import { getTranslations } from "next-intl/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

export async function ReportCardDiscipline({
  absence,
  lateness,
  justifiedAbsence,
  consigne,
  //justifiedLateness,
  id,
}: {
  id: string;
  absence: number;
  lateness: number;
  justifiedAbsence: number;
  justifiedLateness: number;
  consigne: number;
}) {
  console.log(id);
  const t = await getTranslations();
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
            <TableCell className="min-w-[60px]">
              {absence ? absence : ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("justified")}</TableCell>
            <TableCell>{justifiedAbsence ? justifiedAbsence : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("non_justified")}
            </TableCell>
            <TableCell>
              {absence - justifiedAbsence ? absence - justifiedAbsence : ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("late")}</TableCell>
            <TableCell>{lateness ? lateness : ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>{t("consigne")}</TableCell>
            <TableCell>{consigne}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
