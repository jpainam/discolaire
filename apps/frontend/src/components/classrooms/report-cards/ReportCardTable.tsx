import Link from "next/link";

import type { RouterOutputs } from "@repo/api";
import { getServerTranslations } from "@repo/i18n/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { AvatarState } from "~/components/AvatarState";
import { getFullName } from "~/utils/full-name";
import { routes } from "../../../configs/routes";

type ReportCardResult =
  RouterOutputs["reportCard"]["getClassroom"]["result"][number];
export async function ReportCardTable({
  result,
}: {
  result: ReportCardResult[];
}) {
  const { t } = await getServerTranslations();

  return (
    <Table className="text-sm">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>{t("registrationNumber")}</TableHead>
          <TableHead>{t("fullName")}</TableHead>

          <TableHead>{t("avg")}</TableHead>
          <TableHead>{t("rank")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((card, index) => {
          if (card.rank < 0) return null;
          return (
            <TableRow key={card.id}>
              <TableCell className="py-0">
                <AvatarState avatar={card.avatar} pos={index} />
              </TableCell>
              <TableCell className="py-0">{card.registrationNumber}</TableCell>
              <TableCell className="py-0">
                <Link
                  className="font-bold text-blue-600 hover:underline"
                  href={routes.students.details(card.id)}
                >
                  {getFullName(card)}
                </Link>
              </TableCell>

              <TableCell className="py-0">{card.avg?.toFixed(2)}</TableCell>
              <TableCell className="py-0">{card.rank}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
