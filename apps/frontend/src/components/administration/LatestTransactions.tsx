import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { TransactionType } from "@repo/db/enums";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";
import { AvatarState } from "../AvatarState";

export async function LatestTransactions({
  className,
}: {
  className?: string;
}) {
  const transactions = await caller.transaction.all({
    limit: 10,
  });
  const t = await getTranslations();
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("Recent Transactions")}</CardTitle>
        <CardDescription className="text-xs">
          ({transactions.length} {t("transactions")})
        </CardDescription>
        <CardAction>
          <Link href="/administration/accounting/transactions">
            {t("See all")}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="p-4">
        {transactions.slice(0, 6).map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "group flex items-center gap-3",
              "rounded-lg p-2",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
              "transition-all duration-200",
            )}
          >
            <AvatarState
              className="h-8 w-8 rounded-full"
              pos={transaction.student.lastName?.length ?? 0}
              avatar={transaction.student.avatar}
            />

            <div className="flex min-w-0 flex-1 items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {getFullName(transaction.student)}
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
                    transaction.transactionType === TransactionType.CREDIT
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {transaction.transactionType === "CREDIT" ? "+" : "-"}
                  {transaction.amount.toLocaleString("fr", {
                    style: "currency",
                    currency: CURRENCY,
                  })}
                </span>
                {/* {transaction.transactionType === "DEBIT" ? (
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                )} */}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
