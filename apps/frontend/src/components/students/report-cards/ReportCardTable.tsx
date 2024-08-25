"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { routes } from "@/configs/routes";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
//import { StudentReportCard } from "@/types/report-card";
import { getAppreciations } from "@/utils/get-appreciation";
import FlatBadge, { FlatBadgeVariant } from "@repo/ui/FlatBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { sortBy, sum } from "lodash";

export function ReportCardTable({ reportCard }: { reportCard: any[] }) {
  const { t } = useLocale();
  const [groups, setGroups] = useState<Record<number, any[]>>({});
  const [totalCoeff, setTotalCoeff] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [totalAvg, setTotalAvg] = useState<number>(0);

  useEffect(() => {
    const ggs: Record<number, any[]> = {};
    let coeff = 0;
    reportCard.forEach((card) => {
      coeff += card?.isAbsent ? 0 : card?.coefficient || 0;
      const groupId = card?.subjectGroupId;
      if (!groupId) return;
      if (!ggs[groupId]) {
        ggs[groupId] = [];
      }
      card && ggs[groupId]?.push(card);
    });
    setGroups(ggs);
    setTotalCoeff(coeff);
    const ttPoints = sum(
      reportCard.map((c) =>
        c.isAbsent ? 0 : (c.avg || 0) * (c?.coefficient || 0),
      ),
    );
    setTotalPoints(ttPoints);
    const ttavg =
      sum(
        reportCard.map((c) =>
          c.isAbsent ? 0 : (c.avg || 0) * (c?.coefficient || 0),
        ),
      ) / (coeff || 1e9);
    setTotalAvg(ttavg);
  }, [reportCard]);

  const rowClassName = "border text-center py-0 text-sm";

  return (
    <Table className="my-4 border-y text-sm">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[15px]"></TableHead>
          <TableHead className={cn(rowClassName)}>{t("subjects")}</TableHead>
          <TableHead className={cn(rowClassName)}>{t("grades")}</TableHead>
          <TableHead className={cn(rowClassName)}>{t("coeff")}</TableHead>
          <TableHead className={cn(rowClassName)}>{t("total")}</TableHead>
          <TableHead className={cn(rowClassName)}>{t("rank")}</TableHead>
          <TableHead className={cn(rowClassName)}>{t("Avg.C")}</TableHead>
          <TableHead className={cn(rowClassName)}>{t("min_max")}</TableHead>
          <TableHead className="border-y">{t("appreciation")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(groups).map((groupId: string) => {
          let cards = groups[Number(groupId)];
          if (!cards || cards.length == 0) return null;
          cards = sortBy(cards, "order");
          const group = cards[0]?.subjectGroup;
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
                  {group?.name}
                </TableCell>
                <TableCell className={cn(rowClassName)}>
                  {sum(cards.map((c) => c?.coefficient || 0))}
                </TableCell>
                <TableCell className="text-center" colSpan={3}>
                  {t("points")}:{" "}
                  {sum(
                    cards.map((c) => (c.avg || 0) * (c?.coefficient || 0)),
                  ).toFixed(1)}{" "}
                  /{" "}
                  {sum(cards.map((c) => 20 * (c?.coefficient || 0))).toFixed(1)}
                </TableCell>
                <TableCell colSpan={2}>
                  {t("average")} :
                  {(
                    sum(
                      cards.map((c) => (c.avg || 0) * (c?.coefficient || 0)),
                    ) / sum(cards.map((c) => c?.coefficient || 0))
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
        <TableRow className="font-semibold">
          <TableCell></TableCell>
          <TableCell className={cn(rowClassName, "text-left uppercase")}>
            {t("total")}
          </TableCell>
          <TableCell className="border"></TableCell>
          <TableCell className="border text-center">{totalCoeff}</TableCell>
          <TableCell colSpan={3} className={cn(rowClassName)}>
            {t("points")}: {totalPoints.toFixed(2)} /{" "}
            {sum(reportCard.map((c) => 20 * (c?.coefficient || 0))).toFixed(2)}
          </TableCell>
          <TableCell colSpan={2}></TableCell>
        </TableRow>
        <TableRow className="font-semibold">
          <TableCell></TableCell>
          <TableCell className={cn(rowClassName, "text-left uppercase")}>
            {t("average")}
          </TableCell>
          <TableCell className={cn(rowClassName)} colSpan={2}>
            {(totalPoints / (totalCoeff || 1e9)).toFixed(2)}
          </TableCell>
          <TableCell className={cn(rowClassName)} colSpan={3}>
            {t("rank")}: -
          </TableCell>
          <TableCell colSpan={2}>{getAppreciations(totalAvg)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function ReportCardGroup({
  cards,
  groupId,
}: {
  groupId: number;
  cards: any[];
}) {
  const rowClassName = "border text-center py-0 text-sm";

  return (
    <>
      {cards.map((card, index) => {
        return (
          <TableRow key={`card-${groupId}-${index}`}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className={cn(rowClassName, "text-left")}>
              <div className="flex flex-col">
                <span className="font-semibold">
                  {card?.course?.reportName}
                </span>
                <Link
                  href={routes.staffs.details(card?.teacherId || "")}
                  className="ml-4 hover:text-blue-500 hover:underline"
                >
                  {card?.teacher?.prefix} {card?.teacher?.lastName}
                </Link>
              </div>
            </TableCell>
            <TableCell className={cn(rowClassName, "font-bold")}>
              {!card.isAbsent && <Cell n={card?.avg} />}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {!card.isAbsent && card?.coefficient}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {!card?.isAbsent &&
                ((card?.avg || 0) * (card?.coefficient || 0)).toFixed(2)}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {!card.isAbsent && card?.rank}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {card?.classroom.avg.toFixed(2) || "-"}
            </TableCell>
            <TableCell className={cn(rowClassName)}>
              {card?.classroom.min.toFixed(2) || "-"} /{" "}
              {card?.classroom.max.toFixed(2) || "-"}
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
  return <FlatBadge variant={v}>{n.toFixed(2)}</FlatBadge>;
}
