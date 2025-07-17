import { TransactionType } from "@repo/db";
import { sumBy } from "lodash";
import type { IconType } from "react-icons";
import {
  PiBank,
  PiCurrencyCircleDollar,
  PiFolder,
  PiMoneyBold,
} from "react-icons/pi";

import { getServerTranslations } from "~/i18n/server";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { caller } from "~/trpc/server";

export interface TransactionType2 {
  icon: IconType;
  title: string;
  amount: string;
  iconWrapperFill?: string;
  className?: string;
}

export async function TransactionStats({ studentId }: { studentId: string }) {
  const { t, i18n } = await getServerTranslations();
  const transactions = await caller.student.transactions(studentId);
  const classroom = await caller.student.classroom({ studentId });
  const fees = classroom ? await caller.classroom.fees(classroom.id) : [];

  const discounts = transactions
    .filter((t) => t.transactionType == TransactionType.DISCOUNT)
    .map((t) => t.amount);
  const totalDiscount = sumBy(discounts, (d) => d);
  const totalPaid = transactions
    .filter((t) => t.transactionType == TransactionType.CREDIT)
    .map((t) => t.amount)
    .reduce((acc, curr) => acc + curr, 0);

  const statData: TransactionType2[] = [
    {
      title: t("total_fees"),
      amount: sumBy(fees, "amount").toLocaleString(i18n.language),
      icon: PiBank,
      iconWrapperFill: "#8A63D2",
    },
    {
      title: `${t("amountPaid")} / ${t("discount")}`,
      amount: `${totalPaid.toLocaleString(i18n.language)} / ${totalDiscount.toLocaleString(i18n.language)}`,
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
    <div className="grid-cols-1 px-4 mt-2 grid gap-2 2xl:grid-cols-4">
      {statData.map((stat, index: number) => {
        return (
          <div
            key={index}
            className={cn("rounded-md border p-2 bg-muted hover:bg-secondary")}
          >
            <div className="flex items-center gap-5">
              <span
                style={{ backgroundColor: stat.iconWrapperFill }}
                className={cn("flex rounded-lg p-2")}
              >
                <stat.icon className="h-auto w-[30px]" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {stat.title}
                </span>
                <span className="text-md font-semibold">
                  {stat.amount} {CURRENCY}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
