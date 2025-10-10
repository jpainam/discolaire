/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import ContainersIcon from "~/components/icons/containers";
import ExpenseIcon from "~/components/icons/expenses";
import RevenueUpIcon from "~/components/icons/revenue-up";
import SalesIcon from "~/components/icons/sales";
import { SkeletonLineGroup } from "~/components/skeletons/data-table";
import { routes } from "~/configs/routes";
import { useLocale } from "~/i18n";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionTotals() {
  const { t } = useLocale();

  const [searchParams] = useQueryStates(transactionSearchParamsSchema);
  const trpc = useTRPC();
  const { data: stats, isPending } = useSuspenseQuery(
    trpc.transaction.stats.queryOptions({
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId,
      journalId: searchParams.journalId,
    }),
  );

  if (isPending) {
    return (
      <SkeletonLineGroup
        skeletonClassName="h-16 rounded-md w-full"
        columns={4}
        className="grid grid-cols-4 gap-2 p-2"
      />
    );
  }

  const percentage = 4;
  if (!stats) {
    return <div></div>;
  }
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
      <Link href={routes.administration.deleteTransactions}>
        <TransactionStatCard
          title={t("deleted")}
          icon={<ContainersIcon className="h-[45px] w-[45px]" />}
          totalFee={stats.totalDeleted}
          percentage={percentage}
          subtitle={t("sinceLastMonth")}
        />
      </Link>
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
  const { i18n } = useLocale();

  return (
    <div className="bg-muted flex flex-row items-center gap-4 rounded-xl border p-2">
      {icon}
      <div className="flex flex-col">
        <div>{title}</div>
        <p className="font-lexend text-md font-semibold">
          {totalFee?.toLocaleString(i18n.language, {
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
