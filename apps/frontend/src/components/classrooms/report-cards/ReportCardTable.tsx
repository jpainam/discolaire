import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { getServerTranslations } from "@repo/i18n/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { AvatarState } from "~/components/AvatarState";
import { getFullName } from "~/utils/full-name";
import { routes } from "../../../configs/routes";

type ReportCardResult =
  RouterOutputs["reportCard"]["getClassroom"]["result"][number];
export async function ReportCardTable({
  result,
  term,
}: {
  result: ReportCardResult[];
  term: number;
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
          const rank =
            index == 0 || result[index - 1]?.avg != card.avg
              ? card.rank.toString()
              : result[index - 1]?.rank.toString() + " ex";
          return (
            <TableRow key={card.id}>
              <TableCell className="py-0">
                <AvatarState avatar={card.avatar} pos={index} />
              </TableCell>
              <TableCell className="py-0">{card.registrationNumber}</TableCell>
              <TableCell className="py-0">
                <Link
                  className="text-blue-600 underline"
                  href={routes.students.details(card.id)}
                >
                  {getFullName(card)}
                </Link>
              </TableCell>

              <TableCell className="py-0">
                <Link
                  className="flex flex-row items-center hover:underline"
                  href={
                    routes.students.details(card.id) +
                    `/report-cards?term=${term}`
                  }
                >
                  {card.avg?.toFixed(2)}
                  <ExternalLink className="ml-2" size={16} />
                </Link>
              </TableCell>
              <TableCell className="py-0">{rank}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
