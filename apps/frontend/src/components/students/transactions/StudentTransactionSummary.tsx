import { sumBy } from "lodash";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BanknoteX,
  HandCoins,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { TransactionType } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
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

  const feesByJournal = fees.reduce<Record<string, number>>((acc, fee) => {
    const id = fee.journalId ?? "default";
    acc[id] = (acc[id] ?? 0) + fee.amount;
    return acc;
  }, {});

  // 2) Sum transactions per journal *once*
  interface Totals {
    credit: number;
    debit: number;
    discount: number;
  }
  const txByJournal = transactions.reduce<Record<string, Totals>>((acc, t) => {
    const id = t.journalId ?? "default";
    const bucket = acc[id] ?? (acc[id] = { credit: 0, debit: 0, discount: 0 });
    if (t.transactionType === TransactionType.CREDIT) bucket.credit += t.amount;
    else if (t.transactionType === TransactionType.DEBIT)
      bucket.debit += t.amount;
    else bucket.discount += t.amount;
    return acc;
  }, {});

  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <MetricCardGroup className="gap-2 md:grid-cols-3 lg:grid-cols-6">
      {Object.entries(feesByJournal).map(([journalId, feeAmount], index) => {
        const title =
          journals.find((j) => j.id === journalId)?.name ?? "Autres";
        const {
          credit = 0,
          debit = 0,
          discount = 0,
        } = txByJournal[journalId] ?? {};

        const due = credit + discount - debit - feeAmount;

        return (
          <MetricCard key={index} variant={"default"}>
            <MetricCardHeader className="flex items-center justify-between gap-2">
              <MetricCardTitle className="truncate uppercase">
                {title}
              </MetricCardTitle>
              <Banknote className="size-4" />
            </MetricCardHeader>
            <div className="flex flex-row flex-wrap items-center gap-1">
              <MetricCardValue>
                {feeAmount.toLocaleString(locale, {
                  style: "currency",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                  currency: CURRENCY,
                })}
              </MetricCardValue>
              <Badge
                //className="text-[8px]"
                appearance={"outline"}
                variant={due < 0 ? "destructive" : "success"}
              >
                {due.toLocaleString(locale, {
                  style: "currency",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                  currency: CURRENCY,
                })}
              </Badge>
            </div>
          </MetricCard>
        );
      })}
      <MetricCard variant={"success"}>
        <MetricCardHeader className="flex items-center justify-between gap-2">
          <MetricCardTitle className="truncate uppercase">
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
          <MetricCardTitle className="truncate uppercase">
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
          <MetricCardTitle className="truncate uppercase">
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
          <MetricCardTitle className="truncate uppercase">
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
  );
}
