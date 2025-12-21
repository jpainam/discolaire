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

export function ReportCardDiscipline({
  absence,
  lateness,
  justifiedAbsence,
  consigne,
  //justifiedLateness,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
}: {
  id: string;
  absence: number;
  lateness: number;
  justifiedAbsence: number;
  justifiedLateness: number;
  consigne: number;
}) {
  const t = useTranslations();
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
            <TableCell>{Math.max(absence - justifiedAbsence, 0)}</TableCell>
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
