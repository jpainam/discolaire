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
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { caller } from "~/trpc/server";
import { getFullName } from "../../utils/index";

interface Transaction {
  id: string;
  title: string;
  amount: string;
  type: "incoming" | "outgoing";
  category: string;
  icon: LucideIcon;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

// const categoryStyles = {
//   shopping: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
//   food: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
//   transport: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
//   entertainment:
//     "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
// };

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Apple Store Purchase",
    amount: "$999.00",
    type: "outgoing",
    category: "shopping",
    icon: ShoppingCart,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "2",
    title: "Salary Deposit",
    amount: "$4,500.00",
    type: "incoming",
    category: "transport",
    icon: Wallet,
    timestamp: "Today, 9:00 AM",
    status: "completed",
  },
  {
    id: "3",
    title: "Netflix Subscription",
    amount: "$15.99",
    type: "outgoing",
    category: "entertainment",
    icon: CreditCard,
    timestamp: "Yesterday",
    status: "pending",
  },
  {
    id: "4",
    title: "Apple Store Purchase",
    amount: "$999.00",
    type: "outgoing",
    category: "shopping",
    icon: ShoppingCart,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "5",
    title: "Supabase Subscription",
    amount: "$15.99",
    type: "outgoing",
    category: "entertainment",
    icon: CreditCard,
    timestamp: "Yesterday",
    status: "pending",
  },
  {
    id: "6",
    title: "Vercel Subscription",
    amount: "$15.99",
    type: "outgoing",
    category: "entertainment",
    icon: CreditCard,
    timestamp: "Yesterday",
    status: "pending",
  },
];

export async function LatestTransactions({
  className,
}: {
  className?: string;
}) {
  const transactions = await caller.transaction.all({ limit: 6 });
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription className="text-xs">(23 transactions)</CardDescription>
        <CardAction className="text-xs"> This Month</CardAction>
      </CardHeader>
      <CardContent className="p-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "group flex items-center gap-3",
              "p-2 rounded-lg",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
              "transition-all duration-200"
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg",
                "bg-zinc-100 dark:bg-zinc-800",
                "border border-zinc-200 dark:border-zinc-700"
              )}
            >
              <CreditCard className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            </div>

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
                      : "text-red-600 dark:text-red-400"
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
        <Button size={"sm"} className="w-full">
          View All Transactions
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
