"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserLink } from "~/components/UserLink";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

export function ClassroomFinanceTable({
  journalId,
  classroomId,
  fees,
}: {
  journalId: string;
  classroomId: string;
  fees: RouterOutputs["classroom"]["fees"];
}) {
  const trpc = useTRPC();
  const { data: students, isPending: studentsIsPending } = useQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );

  const { data: balances, isPending: balancesIsPending } = useQuery(
    trpc.accountingJournal.studentsBalances.queryOptions({
      classroomId,
      journalId,
    }),
  );
  const locale = useLocale();

  const amountDue = sum(
    fees
      .filter((fee) => fee.dueDate <= new Date() && fee.journalId === journalId)
      .map((fee) => fee.amount),
  );

  const t = useTranslations();
  if (studentsIsPending || balancesIsPending) {
    return <TableSkeleton rows={8} cols={4} />;
  }
  return (
    <div>
      <div className="bg-background overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("amountPaid")}</TableHead>
              <TableHead>{t("amountDue")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((stud, index) => {
              const balance = balances?.get(stud.id) ?? 0;
              return (
                <TableRow key={index}>
                  <TableCell>
                    <UserLink
                      profile="student"
                      id={stud.id}
                      name={getFullName(stud)}
                      avatar={stud.avatar}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      appearance={"outline"}
                      variant={
                        balance < amountDue ? "destructive" : "secondary"
                      }
                    >
                      {balance.toLocaleString(locale, {
                        style: "currency",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                        currency: CURRENCY,
                      })}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(balance - amountDue).toLocaleString(locale, {
                      style: "currency",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                      currency: CURRENCY,
                    })}
                  </TableCell>

                  <TableCell className="text-right"></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
