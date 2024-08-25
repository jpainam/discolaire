"use client";

import { inferProcedureOutput } from "@trpc/server";
import { sumBy } from "lodash";
import { IconType } from "react-icons";
import {
  PiBank,
  PiCurrencyCircleDollar,
  PiFolder,
  PiMoneyBold,
} from "react-icons/pi";

import { useLocale } from "~/hooks/use-locale";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

export type TransactionType = {
  icon: IconType;
  title: string;
  amount: string;
  iconWrapperFill?: string;
  className?: string;
};

type StudentTransactionProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["student"]["transactions"]>
>[number];

export function TransactionStats({
  transactions,
  classroomId,
}: {
  transactions: StudentTransactionProcedureOutput[];
  classroomId: string;
}) {
  const { t, i18n } = useLocale();
  const feesQuery = api.classroom.fees.useQuery(classroomId);
  const fees = feesQuery.data || [];
  const statData: TransactionType[] = [
    {
      title: t("total_fees"),
      amount: sumBy(fees, "amount").toLocaleString(i18n.language),
      icon: PiBank,
      iconWrapperFill: "#8A63D2",
    },
    {
      title: t("amountPaid"),
      amount: sumBy(transactions, "amount").toLocaleString(i18n.language),
      icon: PiCurrencyCircleDollar,
      iconWrapperFill: "#0070F3",
    },
    {
      title: t("amountDue"),
      amount: (
        sumBy(fees, "amount") - sumBy(transactions, "amount")
      ).toLocaleString(i18n.language),
      icon: PiFolder,
      iconWrapperFill: "#F5A623",
    },
    {
      title: t("transactionsCompleted"),
      amount: sumBy(
        transactions.filter((t) => t.status == "VALIDATED"),
        "amount",
      ).toLocaleString(i18n.language),
      icon: PiMoneyBold,
      iconWrapperFill: "#FF0000",
    },
  ];

  return (
    <div className="m-2 grid gap-2 md:grid-cols-4">
      {statData.map((stat: any, index: number) => {
        return (
          <TransactionStatCard key={"transaction-card-" + index} {...stat} />
        );
      })}
    </div>
  );
}

export type TransactionCardProps = {
  className?: string;
  icon: IconType;
  amount: string;
  title: string;
  iconWrapperFill?: string;
};

function TransactionStatCard({
  className,
  icon,
  amount,
  title,
  iconWrapperFill,
}: TransactionCardProps) {
  const Icon = icon;
  return (
    <div
      className={cn(
        "rounded-md border border-gray-300 p-2 hover:bg-secondary",
        className,
      )}
    >
      <div className="flex items-center gap-5">
        <span
          style={{ backgroundColor: iconWrapperFill }}
          className={cn("flex rounded-lg p-2")}
        >
          <Icon className="h-auto w-[30px]" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className="text-md font-semibold">
            {amount} {CURRENCY}
          </span>
        </div>
      </div>
    </div>
  );
}
