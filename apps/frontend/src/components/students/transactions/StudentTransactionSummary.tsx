import { sumBy } from "lodash";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BanknoteX,
  HandCoins,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { TransactionType } from "@repo/db";

import {
  MetricCard,
  MetricCardGroup,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardValue,
} from "~/components/metric-card";
import { CURRENCY } from "~/lib/constants";
import { caller } from "~/trpc/server";

export async function StudentTransactionSummary({
  studentId,
}: {
  studentId: string;
}) {
  const transactions = await caller.student.transactions(studentId);
  const classroom = await caller.student.classroom({ studentId });
  const journals = await caller.accountingJournal.all();
  const fees = classroom ? await caller.classroom.fees(classroom.id) : [];

  const discounts = transactions
    .filter((t) => t.transactionType == TransactionType.DISCOUNT)
    .map((t) => t.amount);
  const totalDiscount = sumBy(discounts, (d) => d);
  const totalPaid = transactions
    .filter((t) => t.transactionType == TransactionType.CREDIT)
    .map((t) => t.amount)
    .reduce((acc, curr) => acc + curr, 0);

  const totalDebit = transactions
    .filter((t) => t.transactionType == TransactionType.DEBIT)
    .map((t) => t.amount)
    .reduce((acc, curr) => acc + curr, 0);

  const totalFees = sumBy(fees, "amount");
  const totalDue = totalFees - totalPaid - totalDiscount + totalDebit;

  const feesGroupedByJournal = fees.reduce<Record<string, number>>(
    (acc, fee) => {
      const key = fee.journalId ?? "default";
      acc[key] = (acc[key] ?? 0) + fee.amount;
      return acc;
    },
    {},
  );
  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <div className="mt-2 px-4">
      <MetricCardGroup className="md:grid-cols-3 lg:grid-cols-6">
        {Object.entries(feesGroupedByJournal).map(
          ([journalId, amount], index) => {
            const title =
              journals.find((j) => j.id === journalId)?.name ?? "Autres";
            return (
              <MetricCard key={index} variant={"default"}>
                <MetricCardHeader className="flex items-center justify-between gap-2">
                  <MetricCardTitle className="truncate">
                    {title}
                  </MetricCardTitle>
                  <Banknote className="size-4" />
                </MetricCardHeader>
                <MetricCardValue>
                  {amount.toLocaleString(locale, {
                    style: "currency",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                    currency: CURRENCY,
                  })}
                </MetricCardValue>
              </MetricCard>
            );
          },
        )}
        <MetricCard variant={"success"}>
          <MetricCardHeader className="flex items-center justify-between gap-2">
            <MetricCardTitle className="truncate">
              {t("amountPaid")}
            </MetricCardTitle>
            <BanknoteArrowDown className="size-4" />
          </MetricCardHeader>
          <MetricCardValue>
            {totalPaid.toLocaleString(locale, {
              style: "currency",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              currency: CURRENCY,
            })}
          </MetricCardValue>
        </MetricCard>
        <MetricCard variant={"warning"}>
          <MetricCardHeader className="flex items-center justify-between gap-2">
            <MetricCardTitle className="truncate">
              {t("discount")}
            </MetricCardTitle>
            <BanknoteX className="size-4" />
          </MetricCardHeader>
          <MetricCardValue>
            {totalDiscount.toLocaleString(locale, {
              style: "currency",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              currency: CURRENCY,
            })}
          </MetricCardValue>
        </MetricCard>
        <MetricCard variant={"destructive"}>
          <MetricCardHeader className="flex items-center justify-between gap-2">
            <MetricCardTitle className="truncate">
              {t("amountDue")}
            </MetricCardTitle>
            <BanknoteArrowUp className="size-4" />
          </MetricCardHeader>
          <MetricCardValue>
            {totalDue.toLocaleString(locale, {
              style: "currency",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              currency: CURRENCY,
            })}
          </MetricCardValue>
        </MetricCard>
        <MetricCard variant={"success"}>
          <MetricCardHeader className="flex items-center justify-between gap-2">
            <MetricCardTitle className="truncate">
              {t("transactionsCompleted")}
            </MetricCardTitle>
            <HandCoins className="size-4" />
          </MetricCardHeader>
          <MetricCardValue>
            {sumBy(
              transactions.filter((t) => t.status == "VALIDATED"),
              "amount",
            ).toLocaleString(locale, {
              style: "currency",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              currency: CURRENCY,
            })}
          </MetricCardValue>
        </MetricCard>
      </MetricCardGroup>
    </div>
  );
}
