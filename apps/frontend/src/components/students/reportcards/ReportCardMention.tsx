import { CheckIcon } from "lucide-react";
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

export async function ReportCardMention({
  average,
  id,
}: {
  id: string;
  average: number;
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
              {t("mention")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("congratulations")}
            </TableCell>
            <TableCell className="min-w-[60px] text-center">
              {average >= 18 && (
                <div className="flex items-center justify-center">
                  <CheckIcon className="h-4 w-4" />
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("encouragments")}
            </TableCell>
            <TableCell className="text-center">
              {average >= 14 && (
                <div className="flex items-center justify-center">
                  <CheckIcon className="h-4 w-4" />
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("roll_of_honor")}
            </TableCell>
            <TableCell className="text-center">
              {average >= 12 && (
                <div className="flex items-center justify-center">
                  <CheckIcon className="h-4 w-4" />
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("work_warning")}
            </TableCell>
            <TableCell>
              {average <= 9.99 && (
                <div className="flex items-center justify-center">
                  <CheckIcon className="h-4 w-4 self-center" />
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn(rowClassName)}>
              {t("work_blame")}
            </TableCell>
            <TableCell>
              {average <= 5.99 && (
                <div className="flex items-center justify-center">
                  <CheckIcon className="h-4 w-4 self-center" />
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
