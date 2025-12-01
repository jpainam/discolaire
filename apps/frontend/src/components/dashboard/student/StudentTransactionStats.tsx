import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import {
  PiChartBarHorizontal,
  PiChartLineUp,
  PiChartPieSlice,
  PiMoney,
} from "react-icons/pi";

import { Card, CardContent, CardFooter } from "@repo/ui/components/card";

import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { caller } from "~/trpc/server";

export async function StudentTransactionStat({
  className,
  studentId,
}: {
  className?: string;
  studentId: string;
}) {
  const classroom = await caller.student.classroom({ studentId: studentId });
  const transactions = await caller.student.transactions(studentId);
  let totalFees = 0;
  if (classroom) {
    const fees = await caller.classroom.fees(classroom.id);
    totalFees = fees.reduce((acc, fee) => acc + fee.amount, 0);
  }
  const totalTransactions = transactions.reduce(
    (acc, transaction) =>
      acc +
      (transaction.status == "VALIDATED" &&
      transaction.transactionType != "DEBIT"
        ? transaction.amount
        : 0),
    0,
  );
  const t = await getTranslations();

  return (
    <div className={cn("grid flex-row gap-2 md:flex", className)}>
      <TransactionStatCard
        studentId={studentId}
        title={totalFees}
        icon={<PiMoney className="h-24 w-24 text-orange-100/10" />}
        subtitle={t("total_fees")}
        className="bg-orange-800 text-orange-200"
      />
      <TransactionStatCard
        studentId={studentId}
        title={totalTransactions}
        icon={<PiChartLineUp className="h-24 w-24 text-blue-100/10" />}
        subtitle={t("amountPaid")}
        className="bg-blue-800 text-blue-200"
      />
      <TransactionStatCard
        studentId={studentId}
        title={totalFees - totalTransactions}
        icon={<PiChartPieSlice className="h-24 w-24 text-lime-100/10" />}
        subtitle={t("amountDue")}
        className="bg-lime-800 text-lime-200"
      />
      <TransactionStatCard
        studentId={studentId}
        title={transactions.reduce(
          (acc, transaction) =>
            acc + (transaction.status == "VALIDATED" ? transaction.amount : 0),
          0,
        )}
        icon={<PiChartBarHorizontal className="h-24 w-24 text-amber-100/10" />}
        subtitle={t("transactionsCompleted")}
        className="bg-amber-800 text-amber-200"
      />
    </div>
  );
}

async function TransactionStatCard({
  title,
  subtitle,
  className,
  studentId,
  icon,
}: {
  title: number;
  subtitle: string;
  studentId: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  return (
    <Card className={cn("w-full p-0", className)}>
      {/* <CardHeader>
        <CardTitle>
          {title.toLocaleString(locale, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: CURRENCY,
            style: "currency",
          })}
        </CardTitle>
        <CardDescription>{subtitle}</CardDescription>
        <CardAction>{icon}</CardAction>
      </CardHeader> */}
      <CardContent className="relative py-2">
        <div className="absolute inset-0 flex items-center justify-end">
          {icon}
        </div>
        <div className="relative space-y-2">
          <span className="text-lg font-extrabold">
            {title.toLocaleString(locale, {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              currency: CURRENCY,
              style: "currency",
            })}
          </span>
          <p className="text-sm">{subtitle}</p>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Link
          href={`/students/${studentId}/transactions`}
          className="flex w-full flex-row items-center justify-center gap-4 rounded-b-lg bg-gray-800/20 px-4 py-2 text-sm hover:underline"
        >
          {t("more_info")} <CircleArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
