import { Button } from "@repo/ui/components/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { subDays } from "date-fns";
import { ArrowDownLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";
import { AvatarState } from "../AvatarState";

export async function LatestTransactions({
  className,
}: {
  className?: string;
}) {
  const today = new Date();
  const transactions = await caller.transaction.all({
    from: subDays(today, 30),
  });
  const { t } = await getServerTranslations();
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("Recent Transactions")}</CardTitle>
        <CardDescription className="text-xs">
          ({transactions.length} {t("transactions")})
        </CardDescription>
        <CardAction className="text-xs">{t("This Month")}</CardAction>
      </CardHeader>
      <CardContent className="p-4">
        {transactions.slice(0, 6).map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "group flex items-center gap-3",
              "p-2 rounded-lg",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
              "transition-all duration-200",
            )}
          >
            <AvatarState
              className="w-8 h-8 rounded-full"
              pos={transaction.account.student.lastName?.length ?? 0}
              avatar={transaction.account.student.user?.avatar}
            />

            <div className="flex-1 flex items-center justify-between min-w-0">
              <div className="space-y-0.5">
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {getFullName(transaction.account.student)}
                </h3>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  {transaction.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-1.5 pl-3">
                <span
                  className={cn(
                    "text-xs font-medium",
                    transaction.transactionType === "incoming"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {transaction.transactionType === "CREDIT" ? "+" : "-"}
                  {transaction.amount}
                </span>
                {transaction.transactionType === "DEBIT" ? (
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Link
          className="w-full"
          href={"/administration/accounting/transactions"}
        >
          <Button size={"sm"} className="w-full">
            {t("View All Transactions")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
