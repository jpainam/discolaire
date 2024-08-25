import {
  PiChartBarHorizontal,
  PiChartLineUp,
  PiChartPieSlice,
  PiMoney,
} from "react-icons/pi";

import { getServerTranslations } from "~/app/i18n/server";
import { cn } from "~/lib/utils";
import { TransactionStatCard } from "./TransactionStatCard";

export async function TransactionStat({ className }: { className?: string }) {
  const { t } = await getServerTranslations("description");
  return (
    <div className={cn("grid flex-row gap-2 md:flex", className)}>
      <TransactionStatCard
        title={2000}
        icon={
          <PiMoney className="h-28 w-28 text-orange-800/10 dark:text-orange-100/10" />
        }
        subtitle={t("amount_due")}
        className="bg-orange-50 text-orange-700 dark:bg-orange-800 dark:text-orange-200"
      />
      <TransactionStatCard
        title={2000}
        icon={
          <PiChartLineUp className="h-28 w-28 text-blue-800/10 dark:text-blue-100/10" />
        }
        subtitle={t("total_income")}
        className="bg-blue-50 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
      />
      <TransactionStatCard
        title={2000}
        icon={
          <PiChartPieSlice className="h-28 w-28 text-lime-800/10 dark:text-lime-100/10" />
        }
        subtitle={t("income_this_month")}
        className="bg-lime-50 text-lime-700 dark:bg-lime-800 dark:text-lime-200"
      />
      <TransactionStatCard
        title={0}
        icon={
          <PiChartBarHorizontal className="h-28 w-28 text-amber-800/10 dark:text-amber-100/10" />
        }
        subtitle={t("income_today")}
        className="bg-amber-50 text-amber-700 dark:bg-amber-800 dark:text-amber-200"
      />
      {/* <TransactionStatCard
        title={2000}
        icon={
          <PiChartPieSlice className="h-28 w-28 text-gray-800/10 dark:text-gray-700" />
        }
        subtitle="dues- amount"
        className="bg-teal-500"
      />
      <TransactionStatCard
        title={2000}
        icon={
          <PiChartPieSlice className="h-28 w-28 text-gray-800/10 dark:text-gray-700" />
        }
        subtitle="dues- amount"
        className="bg-emerald-500"
      /> */}
    </div>
  );
}
