"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { decode } from "entities";
import { DollarSign, PrinterIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { TransactionStatus } from "@repo/db/enums";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { Badge } from "~/components/base-badge";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";

const signedAmount = (
  txType: "DEBIT" | "CREDIT" | "DISCOUNT",
  amount: number,
) => {
  if (txType === "DEBIT") return -Math.abs(amount);
  return Math.abs(amount);
};

const sum = (n: number[]) => {
  return n.reduce((a, b) => a + b, 0);
};

export function ClassroomFund({
  classroomId,
  journalId,
}: {
  classroomId: string;
  journalId: string;
}) {
  const trpc = useTRPC();
  const t = useTranslations();
  const locale = useLocale();
  const transactionQuery = useQuery(
    trpc.transaction.all.queryOptions({ classroomId, journalId }),
  );
  const feeQuery = useQuery(trpc.classroom.fees.queryOptions(classroomId));
  const studentQuery = useQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );

  const totalFees = useMemo(() => {
    const fees = feeQuery.data ?? [];
    return sum(
      fees.filter((f) => f.journalId == journalId).map((f) => f.amount),
    );
  }, [feeQuery.data, journalId]);

  const balances = useMemo(() => {
    const map = new Map<string, number>();
    const transactions = transactionQuery.data ?? [];
    for (const tx of transactions) {
      let prev = map.get(tx.studentId) ?? 0;
      prev += signedAmount(tx.transactionType, tx.amount);
      map.set(tx.studentId, prev);
    }
    return map;
  }, [transactionQuery.data]);

  if (transactionQuery.isPending || studentQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 px-2">
        {Array.from({ length: 16 }).map((_, index) => (
          <Skeleton key={index} className="h-8" />
        ))}
      </div>
    );
  }
  const transactions = transactionQuery.data ?? [];
  const students = studentQuery.data ?? [];

  const validatedTransactions = transactions
    .filter((t) => t.status == TransactionStatus.VALIDATED)
    .map((t) => t.amount);

  const pendingTransactions = transactions
    .filter((t) => t.status == TransactionStatus.PENDING)
    .map((t) => t.amount);

  if (transactionQuery.data && transactionQuery.data.length == 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DollarSign />
          </EmptyMedia>
          <EmptyTitle>Aucune transactions</EmptyTitle>
          <EmptyDescription>
            Vous n'avez aucune transaction pour cette classe
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent></EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-auto px-2">
      <div className="flex flex-wrap gap-4 px-4">
        <Badge variant={"success"} appearance={"outline"}>
          {t("validated")}:{" "}
          {sum(validatedTransactions).toLocaleString(locale, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: CURRENCY,
          })}
        </Badge>
        <Badge variant={"warning"} appearance={"outline"}>
          {t("pending")} :{" "}
          {sum(pendingTransactions).toLocaleString(locale, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: CURRENCY,
          })}
        </Badge>
        <Badge variant={"info"} appearance={"outline"}>
          {t("total_fees")} :{" "}
          {totalFees.toLocaleString(locale, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: CURRENCY,
          })}
        </Badge>
      </div>
      <div className="h-full overflow-auto border">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>{t("student")}</TableHead>
              <TableHead className="text-right">{t("amount")}</TableHead>
              <TableHead className="w-[25px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="More Options"
                    >
                      <PrinterIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => {
                        window.open(
                          `/api/pdfs/accounting/funds?journalId=${journalId}&classroomId=${classroomId}&format=pdf`,
                          "_blank",
                        );
                      }}
                    >
                      <PDFIcon />
                      {t("pdf_export")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        window.open(
                          `/api/pdfs/accounting/funds?journalId=${journalId}&classroomId=${classroomId}&format=csv`,
                          "_blank",
                        );
                      }}
                    >
                      <XMLIcon />
                      {t("xml_export")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => {
              const amount = balances.get(student.id) ?? 0;
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      className="hover:underline"
                      href={`/students/${student.id}/transactions`}
                    >
                      {decode(student.lastName ?? student.firstName ?? "")}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right" colSpan={2}>
                    <Badge
                      variant={
                        amount < totalFees
                          ? "destructive"
                          : amount == totalFees
                            ? "success"
                            : "warning"
                      }
                      appearance={"outline"}
                    >
                      {/* {amount != 0 && (
                        <>
                          {amount < totalFees
                            ? "-"
                            : amount > totalFees
                              ? "+"
                              : ""}
                        </>
                      )} */}
                      {amount.toLocaleString(locale, {
                        style: "currency",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                        currency: CURRENCY,
                      })}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
