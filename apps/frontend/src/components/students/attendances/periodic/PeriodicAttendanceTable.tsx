import { getServerTranslations } from "@repo/i18n/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { PeriodicAttendanceTableActions } from "./PeriodicAttendanceTableActions";

export async function PeriodicAttendanceTable({
  term,
  studentId,
}: {
  term: number;
  studentId: string;
}) {
  const { t } = await getServerTranslations();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("total_absences")}</TableHead>
          <TableHead>{t("justified_absences")}</TableHead>
          <TableHead>{t("unjustified_absences")}</TableHead>
          <TableHead>{t("consignes")}</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell>INV001</TableCell>
          <TableCell className="text-right">.00</TableCell>
          <TableCell>
            <PeriodicAttendanceTableActions studentId={studentId} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
