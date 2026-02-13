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

interface JournalTotals {
  credit: number;
  debit: number;
  discount: number;
}

export async function ContactTransactionSummary({
  contactId,
}: {
  contactId: string;
}) {
  const [studentLinks, transactions, journals] = await Promise.all([
    caller.contact.students(contactId),
    caller.contact.transactions(contactId),
    caller.accountingJournal.all(),
  ]);

  const studentIds = studentLinks.map((studentLink) => studentLink.studentId);

  const classrooms = await Promise.all(
    studentIds.map(async (studentId) =>
      caller.student.classroom({
        studentId,
      }),
    ),
  );

  const classroomCounts = classrooms.reduce<Record<string, number>>(
    (acc, classroom) => {
      if (!classroom) {
        return acc;
      }
      acc[classroom.id] = (acc[classroom.id] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const classroomIds = Object.keys(classroomCounts);

  const classroomFees = await Promise.all(
    classroomIds.map(async (classroomId) => {
      const fees = await caller.classroom.fees(classroomId);
      return { classroomId, fees };
    }),
  );

  const feesByJournal = classroomFees.reduce<Record<string, number>>(
    (acc, { classroomId, fees }) => {
      const multiplier = classroomCounts[classroomId] ?? 0;
      for (const fee of fees) {
        const journalId = fee.journalId ?? "default";
        acc[journalId] = (acc[journalId] ?? 0) + fee.amount * multiplier;
      }
      return acc;
    },
    {},
  );

  const txByJournal = transactions.reduce<Record<string, JournalTotals>>(
    (acc, transaction) => {
      const journalId = transaction.journalId ?? "default";
      const bucket =
        acc[journalId] ??
        (acc[journalId] = { credit: 0, debit: 0, discount: 0 });
      if (transaction.transactionType === TransactionType.CREDIT) {
        bucket.credit += transaction.amount;
      } else if (transaction.transactionType === TransactionType.DEBIT) {
        bucket.debit += transaction.amount;
      } else {
        bucket.discount += transaction.amount;
      }
      return acc;
    },
    {},
  );

  const totalPaid = transactions.reduce((acc, transaction) => {
    if (transaction.transactionType !== TransactionType.CREDIT) {
      return acc;
    }
    return acc + transaction.amount;
  }, 0);

  const totalDebit = transactions.reduce((acc, transaction) => {
    if (transaction.transactionType !== TransactionType.DEBIT) {
      return acc;
    }
    return acc + transaction.amount;
  }, 0);

  const totalDiscount = transactions.reduce((acc, transaction) => {
    if (transaction.transactionType !== TransactionType.DISCOUNT) {
      return acc;
    }
    return acc + transaction.amount;
  }, 0);

  const totalFees = Object.values(feesByJournal).reduce(
    (acc, feeAmount) => acc + feeAmount,
    0,
  );
  const totalDue = totalFees - totalPaid - totalDiscount + totalDebit;

  const journalNameById = new Map(
    journals.map((journal) => [journal.id, journal.name]),
  );

  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <MetricCardGroup className="gap-2 md:grid-cols-3 lg:grid-cols-6">
      {Object.entries(feesByJournal).map(([journalId, feeAmount]) => {
        const title = journalNameById.get(journalId) ?? "Autres";
        const {
          credit = 0,
          debit = 0,
          discount = 0,
        } = txByJournal[journalId] ?? {};
        const due = credit + discount - debit - feeAmount;

        return (
          <MetricCard key={journalId} variant="default">
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
                appearance="outline"
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
      <MetricCard variant="success">
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
      <MetricCard variant="warning">
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
      <MetricCard variant="destructive">
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
      <MetricCard variant="success">
        <MetricCardHeader className="flex items-center justify-between gap-2">
          <MetricCardTitle className="truncate uppercase">
            {t("transactionsCompleted")}
          </MetricCardTitle>
          <HandCoins className="size-4" />
        </MetricCardHeader>
        <MetricCardValue>
          {transactions
            .filter((transaction) => transaction.status === "VALIDATED")
            .reduce((acc, transaction) => acc + transaction.amount, 0)
            .toLocaleString(locale, {
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
