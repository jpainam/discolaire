"use client";

import Link from "next/link";
import { parseAsIsoDateTime, useQueryState } from "nuqs";

import ContainersIcon from "~/components/icons/containers";
import ExpenseIcon from "~/components/icons/expenses";
import RevenueUpIcon from "~/components/icons/revenue-up";
import SalesIcon from "~/components/icons/sales";
import { SkeletonLineGroup } from "~/components/skeletons/data-table";
import { routes } from "~/configs/routes";
import { useLocale } from "~/hooks/use-locale";
import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";

export function TransactionTotals() {
  const { t } = useLocale();

  const [from, _] = useQueryState("from", parseAsIsoDateTime);
  const [to, __] = useQueryState("to", parseAsIsoDateTime);
  const transactionsStats = api.transaction.stats.useQuery({
    from: from || undefined,
    to: to || undefined,
  });

  if (transactionsStats.isPending) {
    return (
      <SkeletonLineGroup
        skeletonClassName="h-16 rounded-md w-full"
        columns={4}
        className="grid grid-cols-4 gap-2 p-2"
      />
    );
  }
  if (transactionsStats.isError) {
    throw transactionsStats.error;
  }
  const stats = transactionsStats.data;
  const percentage = 4;
  return (
    <div className="mt-2 grid w-full grid-cols-4 gap-4 py-1 text-sm">
      <TransactionStatCard
        title={t("totalCurrentFees")}
        icon={<RevenueUpIcon className="h-[45px] w-[45px]" />}
        totalFee={stats?.totalFee}
        subtitle={t("sinceLastMonth")}
        percentage={percentage}
      />
      <TransactionStatCard
        title={t("totalCompletedAmount")}
        icon={<SalesIcon className="h-[45px] w-[45px]" />}
        totalFee={stats?.totalCompleted}
        percentage={percentage}
        subtitle={t("sinceLastMonth")}
      />
      <TransactionStatCard
        title={t("totalUnvalidatedAmount")}
        icon={<ExpenseIcon className="h-[45px] w-[45px]" />}
        totalFee={stats?.totalInProgress}
        percentage={percentage}
        subtitle={t("sinceLastMonth")}
      />
      <Link href={routes.administration.deleteTransactions}>
        <TransactionStatCard
          title={t("totalTransactionDeleted")}
          icon={<ContainersIcon className="h-[45px] w-[45px]" />}
          totalFee={stats?.totalDeleted}
          percentage={percentage}
          subtitle={t("sinceLastMonth")}
        />
      </Link>
    </div>
  );
}

type TransactionStatCardProps = {
  totalFee?: number | null;
  percentage: number;
  icon: React.ReactNode;
  subtitle?: string;
  title?: string;
};
function TransactionStatCard({
  totalFee,
  percentage,
  icon,
  subtitle,
  title,
}: TransactionStatCardProps) {
  const { t, i18n } = useLocale();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-4">
        {icon}
        <div className="flex flex-col">
          <div>{title}</div>
          <p className="font-lexend text-md font-semibold">
            {totalFee?.toLocaleString(i18n.language, {
              style: "currency",
              currency: CURRENCY,
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }) || 0}
          </p>
        </div>
      </div>
      {/* <div className="flex items-center leading-none text-gray-500">
        <span
          className={cn(
            "inline-flex items-center font-medium",
            percentage > 0 ? "text-green-500" : "text-red-500"
          )}
        >
          {" "}
          <TrendingUpIcon className="text-green ml-1 h-4 w-4" />
          {percentage > 0 ? "+" : ""}
          {percentage}%
        </span>
        <span className="ml-1 inline-flex">{subtitle}</span>
      </div> */}
    </div>
  );
}
