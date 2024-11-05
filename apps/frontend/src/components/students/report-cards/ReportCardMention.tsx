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

export async function ReportCardMention({ id }: { id: string }) {
  console.log(id);
  const { t } = await getServerTranslations();
  const rowClassName = "border-r text-sm";
  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold" colSpan={2}>
              {t("mention")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("congratulations")}
            </TableCell>
            <TableCell className="w-[60px]"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("encouragments")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("roll_of_honor")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("work_warning")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("work_blame")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
