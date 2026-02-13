"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheckIcon, Banknote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { TransactionType } from "@repo/db/enums";

import { EmptyComponent } from "~/components/EmptyComponent";
import FlatBadge from "~/components/FlatBadge";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { routes } from "~/configs/routes";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function ContactTransactionTable() {
  const params = useParams<{ id: string }>();
  const locale = useLocale();
  const t = useTranslations();
  const trpc = useTRPC();

  const fullDateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const { data: transactions } = useSuspenseQuery(
    trpc.contact.transactions.queryOptions(params.id),
  );

  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("transactionRef")}</TableHead>
            <TableHead>{t("student")}</TableHead>
            <TableHead>{t("transactionType")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <EmptyComponent />
              </TableCell>
            </TableRow>
          )}
          {transactions.map((transaction) => {
            const studentName =
              transaction.student.lastName ?? transaction.student.firstName;

            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Link
                    className="hover:text-blue-600 hover:underline"
                    href={routes.students.transactions.details(
                      transaction.studentId,
                      transaction.id,
                    )}
                  >
                    {transaction.transactionRef}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={routes.students.transactions.index(
                      transaction.studentId,
                    )}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {studentName}
                  </Link>
                </TableCell>
                <TableCell>
                  {transaction.transactionType === TransactionType.DISCOUNT ? (
                    <FlatBadge variant="pink">{t("discount")}</FlatBadge>
                  ) : transaction.transactionType === TransactionType.DEBIT ? (
                    <FlatBadge variant="red">{t("debit")}</FlatBadge>
                  ) : (
                    <FlatBadge variant="green">{t("credit")}</FlatBadge>
                  )}
                </TableCell>
                <TableCell>
                  {fullDateFormatter.format(transaction.createdAt)}
                </TableCell>
                <TableCell>
                  <Link
                    className="hover:text-blue-600 hover:underline"
                    href={routes.students.transactions.details(
                      transaction.studentId,
                      transaction.id,
                    )}
                  >
                    {transaction.description}
                  </Link>
                </TableCell>
                <TableCell>
                  {transaction.amount.toLocaleString(locale, {
                    style: "currency",
                    currency: CURRENCY,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      <Banknote />
                      {transaction.journal?.name}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn(
                        transaction.status === "VALIDATED"
                          ? "bg-blue-500 text-white dark:bg-blue-600"
                          : "bg-red-500 text-white dark:bg-red-600",
                      )}
                    >
                      <BadgeCheckIcon />
                      {t(transaction.status)}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
