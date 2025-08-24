/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment } from "react";
import Link from "next/link";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbTransactionDollar } from "react-icons/tb";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { routes } from "~/configs/routes";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await paramsPromise;
  const { t, i18n } = await getServerTranslations();

  const student = await caller.student.get(id);
  const statements = await caller.studentAccount.getStatements({
    studentId: id,
  });

  const formatAmount = (amount: number) =>
    amount.toLocaleString(i18n.language, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, {
      month: "short",
      year: "numeric",
      day: "numeric",
    }).format(date);

  const totalPeriodMap: Record<string, number> = {};
  for (const item of statements) {
    const key = `${item.transactionDate.getFullYear()}-${item.transactionDate.getMonth()}`;
    const signedAmount =
      item.type === "DEBIT" ? -Math.abs(item.amount) : item.amount;
    totalPeriodMap[key] = (totalPeriodMap[key] ?? 0) + signedAmount;
  }

  let currentBalance = 0;
  let currentPeriodKey: string | null = null;
  let previousDate: Date | null = null;

  const totalBalance = statements.reduce(
    (acc, item) =>
      acc +
      (item.type === "DEBIT" ? -Math.abs(item.amount) : Math.abs(item.amount)),
    0,
  );

  return (
    <div className="mt-2 px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="font-mono text-xs">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">{t("date")}</TableHead>
              <TableHead>{t("transactionRef")}</TableHead>
              <TableHead>{t("reference")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("debit")}</TableHead>
              <TableHead>{t("credit")}</TableHead>
              <TableHead>{t("balance")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statements.map((item, index) => {
              const itemKey = `${item.transactionDate.getFullYear()}-${item.transactionDate.getMonth()}`;
              const amount = formatAmount(item.amount);
              const signedAmount =
                item.type === "DEBIT" ? -Math.abs(item.amount) : item.amount;
              currentBalance += signedAmount;

              const showSubtotal =
                currentPeriodKey !== null &&
                currentPeriodKey !== itemKey &&
                previousDate !== null;

              const subtotal = showSubtotal ? (
                <SubTotal
                  key={`subtotal-${currentPeriodKey}`}
                  totalperiod={totalPeriodMap[currentPeriodKey ?? ""] ?? 0}
                  previousDate={previousDate ?? new Date()}
                />
              ) : null;

              currentPeriodKey = itemKey;
              previousDate = item.transactionDate;

              return (
                <Fragment key={`${item.transactionRef}-${index}`}>
                  {/* {subtotal} */}
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      {formatDate(item.transactionDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <Link
                        href={
                          item.operation === "fee"
                            ? routes.classrooms.fees(`${item.id}`)
                            : routes.students.transactions.details(
                                id,
                                Number(item.id),
                              )
                        }
                        className="text-blue-700 hover:underline"
                      >
                        {item.transactionRef}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex flex-row items-center gap-2">
                        {item.operation === "fee" ? (
                          <LiaFileInvoiceDollarSolid className="h-4 w-4" />
                        ) : (
                          <TbTransactionDollar className="h-4 w-4" />
                        )}
                        {t(item.reference.toLowerCase())} / {item.classroom}
                      </div>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.type === "DEBIT" ? amount : ""}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.type !== "DEBIT" ? amount : ""}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatAmount(Math.abs(currentBalance))}
                      {currentBalance > 0 ? " cr" : ""}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}

            {/* Final row with student total */}
            <TableRow className="font-bold">
              <TableCell colSpan={2}>{getFullName(student)}</TableCell>
              <TableCell colSpan={4}>{t("total_for_account")}</TableCell>
              <TableCell>
                {formatAmount(Math.abs(totalBalance))}
                {totalBalance > 0 ? " cr" : ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

async function SubTotal({
  totalperiod,
  previousDate,
}: {
  totalperiod: number;
  previousDate: Date;
}) {
  const { t, i18n } = await getServerTranslations();

  const dateLabel = new Intl.DateTimeFormat(i18n.language, {
    month: "numeric",
    year: "numeric",
  }).format(previousDate);

  const formattedAmount = Math.abs(totalperiod).toLocaleString(i18n.language, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  return (
    <TableRow className="text-muted-foreground font-sans font-bold italic">
      <TableCell colSpan={3}></TableCell>
      <TableCell>
        {dateLabel} {t("total_for_period")}
      </TableCell>
      <TableCell>{totalperiod < 0 ? formattedAmount : ""}</TableCell>
      <TableCell>{totalperiod > 0 ? formattedAmount : ""}</TableCell>
      <TableCell />
    </TableRow>
  );
}
