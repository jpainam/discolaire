import { sortBy, sum } from "lodash";
import Link from "next/link";
import { Fragment } from "react";

import type { RouterOutputs } from "@repo/api";
import type { FlatBadgeVariant } from "~/components/FlatBadge";
//import { StudentReportCard } from "~/types/report-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import FlatBadge from "~/components/FlatBadge";
import { getServerTranslations } from "~/i18n/server";

import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import { getAppreciations } from "~/utils/get-appreciation";

type ReportCardType =
  RouterOutputs["reportCard"]["getStudent"]["result"][number];
export async function ReportCardTable({
  groups,
}: {
  groups: Record<number, ReportCardType[]>;
}) {
  const { t } = await getServerTranslations();

  const rowClassName = "";

  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[15px]"></TableHead>
              <TableHead className={cn(rowClassName)}>
                {t("subjects")}
              </TableHead>
              <TableHead className={cn(rowClassName)}>{t("grades")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("coeff")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("total")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("rank")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("Avg.C")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("min_max")}</TableHead>
              <TableHead>{t("appreciation")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(groups).map((groupId: string) => {
              let cards = groups[Number(groupId)];
              if (!cards || cards.length == 0) return null;
              cards = sortBy(cards, "order").filter((c) => !c.isAbsent);
              const card = cards[0];
              if (!card) return null;
              const group = card.subjectGroup;
              if (!group) return null;

              return (
                <Fragment key={`fragment-${groupId}`}>
                  <ReportCardGroup
                    groupId={Number(groupId)}
                    key={`card-${groupId}`}
                    cards={cards}
                  />
                  <TableRow
                    className="bg-secondary text-secondary-foreground"
                    key={`recap-${groupId}`}
                  >
                    <TableCell></TableCell>
                    <TableCell className="" colSpan={2}>
                      {group.name}
                    </TableCell>
                    <TableCell className={cn(rowClassName)}>
                      {sum(cards.map((c) => c.coefficient))}
                    </TableCell>
                    <TableCell className="text-center text-sm" colSpan={3}>
                      {t("points")}:{" "}
                      {sum(
                        cards.map((c) => (c.avg || 0) * c.coefficient),
                      ).toFixed(1)}{" "}
                      / {sum(cards.map((c) => 20 * c.coefficient)).toFixed(1)}
                    </TableCell>
                    <TableCell className="text-sm" colSpan={2}>
                      {t("average")} :
                      {(
                        sum(cards.map((c) => c.avg * c.coefficient)) /
                        sum(cards.map((c) => c.coefficient))
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
            {/* <TableRow className="text-sm font-semibold">
          <TableCell></TableCell>
          <TableCell className={cn(rowClassName, "text-left uppercase")}>
            {t("total")}
          </TableCell>
          <TableCell className="border"></TableCell>
          <TableCell className="border text-center">{totalCoeff}</TableCell>
          <TableCell colSpan={3} className={cn(rowClassName)}>
            {t("points")}: {points.toFixed(2)} / {totalPoints}
          </TableCell>
          <TableCell colSpan={2}></TableCell>
        </TableRow> */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ReportCardGroup({
  cards,
  groupId,
}: {
  groupId: number;
  cards: ReportCardType[];
}) {
  const rowClassName = "border text-center py-0";

  return (
    <>
      {cards.map((card, index) => {
        return (
          <TableRow className="text-xs" key={`card-${groupId}-${index}`}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className={cn(rowClassName, "text-left")}>
              <div className="flex flex-col">
                <span className="font-semibold">{card.course.reportName}</span>
                <Link
                  href={routes.staffs.details(card.teacherId ?? "#")}
                  className="ml-4 hover:text-blue-500 hover:underline"
                >
                  {card.teacher?.prefix} {card.teacher?.lastName}
                </Link>
              </div>
            </TableCell>
            <TableCell className={cn(rowClassName, "font-bold")}>
              {!card.isAbsent && <Cell n={card.avg} />}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {!card.isAbsent && card.coefficient}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {!card.isAbsent && (card.avg * card.coefficient).toFixed(2)}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {!card.isAbsent && card.rank}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {card.classroom.avg.toFixed(2)}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {card.classroom.min.toFixed(2)} / {card.classroom.max.toFixed(2)}
            </TableCell>
            <TableCell className={cn("border-y text-left uppercase")}>
              {!card.isAbsent && getAppreciations(card.avg || 0)}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}

function Cell({ n }: { n?: number | null }) {
  let v: FlatBadgeVariant = "green";

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (n == undefined || n == null) {
    return <></>;
  }
  if (n < 10) {
    v = "red";
  } else if (n < 12) {
    v = "yellow";
  } else if (n < 14) {
    v = "blue";
  }
  return (
    <FlatBadge
      className="w-[50px] justify-center text-center text-xs font-normal"
      variant={v}
    >
      {n.toFixed(2)}
    </FlatBadge>
  );
}
