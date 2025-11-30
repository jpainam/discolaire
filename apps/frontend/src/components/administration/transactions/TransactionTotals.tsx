/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useLocale, useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import ContainersIcon from "~/components/icons/containers";
import ExpenseIcon from "~/components/icons/expenses";
import RevenueUpIcon from "~/components/icons/revenue-up";
import SalesIcon from "~/components/icons/sales";
import { CURRENCY } from "~/lib/constants";

export function TransactionTotals({
  stats,
}: {
  stats: RouterOutputs["transaction"]["stats"];
}) {
  const t = useTranslations();

  const percentage = 4;

  return (
    <div className="mt-2 grid w-full grid-cols-1 gap-4 py-1 text-sm md:grid-cols-3 lg:grid-cols-4">
      {/* <TransactionStatCard
        title={t("fees")}
        icon={<RevenueUpIcon className="h-[45px] w-[45px]" />}
        totalFee={stats.totalFee}
        subtitle={t("sinceLastMonth")}
        percentage={percentage}
      /> */}
      <TransactionStatCard
        title={t("totals")}
        icon={<RevenueUpIcon className="h-[45px] w-[45px]" />}
        totalFee={stats.totalCompleted + stats.totalInProgress}
        subtitle={t("sinceLastMonth")}
        percentage={percentage}
      />
      <TransactionStatCard
        title={t("validated")}
        icon={<SalesIcon className="h-[45px] w-[45px]" />}
        totalFee={stats.totalCompleted}
        percentage={percentage}
        subtitle={t("sinceLastMonth")}
      />
      <TransactionStatCard
        title={t("pending")}
        icon={<ExpenseIcon className="h-[45px] w-[45px]" />}
        totalFee={stats.totalInProgress}
        percentage={percentage}
        subtitle={t("sinceLastMonth")}
      />

      <TransactionStatCard
        title={t("deleted")}
        icon={<ContainersIcon className="h-[45px] w-[45px]" />}
        totalFee={stats.totalDeleted}
        percentage={percentage}
        subtitle={t("sinceLastMonth")}
      />
    </div>
  );
}

interface TransactionStatCardProps {
  totalFee?: number | null;
  percentage: number;
  icon: React.ReactNode;
  subtitle?: string;
  title?: string;
}
function TransactionStatCard({
  totalFee,
  percentage,
  icon,
  subtitle,
  title,
}: TransactionStatCardProps) {
  const locale = useLocale();

  return (
    <div className="bg-muted flex flex-row items-center gap-4 rounded-xl border p-2">
      {icon}
      <div className="flex flex-col">
        <div>{title}</div>
        <p className="font-lexend text-md font-semibold">
          {totalFee?.toLocaleString(locale, {
            style: "currency",
            currency: CURRENCY,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }) ?? 0}
        </p>
      </div>
    </div>
  );
}
