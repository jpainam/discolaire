import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
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

  const t = await getTranslations();
  const locale = await getLocale();

  const student = await caller.student.get(id);
  const statements = await caller.studentAccount.getStatements({
    studentId: id,
  });

  const formatAmount = (amount: number) =>
    amount.toLocaleString(locale, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
      day: "numeric",
    }).format(date);

  // Totals per period (e.g., 2025-0 for Jan 2025)
  const totalPeriodMap: Record<string, number> = {};
  for (const item of statements) {
    const key = `${item.transactionDate.getFullYear()}-${item.transactionDate.getMonth()}`;
    const signed = item.type === "DEBIT" ? -Math.abs(item.amount) : item.amount;
    totalPeriodMap[key] = (totalPeriodMap[key] ?? 0) + signed;
  }

  interface TxRow {
    kind: "tx";
    item: (typeof statements)[number];
    balanceAfter: number;
  }
  interface SubtotalRow {
    kind: "subtotal";
    periodKey: string;
    previousDate: Date;
    total: number;
  }
  type Row = TxRow | SubtotalRow;

  // Build immutable rows with a single pass (no mutations in JSX)
  const { rows } = statements.reduce<{
    rows: Row[];
    running: number;
    currentPeriodKey: string | null;
    previousDate: Date | null;
  }>(
    (acc, item) => {
      const itemKey = `${item.transactionDate.getFullYear()}-${item.transactionDate.getMonth()}`;
      const signed =
        item.type === "DEBIT" ? -Math.abs(item.amount) : item.amount;

      // If we detect a period change, insert a subtotal row BEFORE the new tx
      const showSubtotal =
        acc.currentPeriodKey !== null &&
        acc.currentPeriodKey !== itemKey &&
        acc.previousDate !== null;
      if (showSubtotal && acc.currentPeriodKey && acc.previousDate) {
        acc.rows.push({
          kind: "subtotal",
          periodKey: acc.currentPeriodKey,
          previousDate: acc.previousDate,
          total: totalPeriodMap[acc.currentPeriodKey] ?? 0,
        });
      }

      const newRunning = acc.running + signed;
      acc.rows.push({ kind: "tx", item, balanceAfter: newRunning });

      acc.running = newRunning;
      acc.currentPeriodKey = itemKey;
      acc.previousDate = item.transactionDate;
      return acc;
    },
    { rows: [], running: 0, currentPeriodKey: null, previousDate: null },
  );

  // Final account total
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
            {rows.map((row, idx) => {
              if (row.kind === "subtotal") {
                return (
                  <SubTotal
                    key={`subtotal-${row.periodKey}-${idx}`}
                    totalperiod={row.total}
                    previousDate={row.previousDate}
                  />
                );
              }

              const { item, balanceAfter } = row;
              const amountStr = formatAmount(item.amount);

              return (
                <TableRow key={`${item.transactionRef}-${idx}`}>
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
                      {item.reference.toLowerCase()} / {item.classroom}
                    </div>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.type === "DEBIT" ? amountStr : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.type !== "DEBIT" ? amountStr : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatAmount(Math.abs(balanceAfter))}
                    {balanceAfter > 0 ? " cr" : ""}
                  </TableCell>
                </TableRow>
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
