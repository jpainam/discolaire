import { ArrowUpRight, CreditCard, QrCode, Wallet } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

interface AccountItem {
  id: string;
  title: string;
  description?: string;
  balance: string;
  type: "savings" | "checking" | "investment" | "debt";
}

const accounts: AccountItem[] = [
  {
    id: "1",
    title: "Main Savings",
    description: "Personal savings",
    balance: "$8,459.45",
    type: "savings",
  },
  {
    id: "2",
    title: "Checking Account",
    description: "Daily expenses",
    balance: "$2,850.00",
    type: "checking",
  },
  {
    id: "3",
    title: "Investment Portfolio",
    description: "Stock & ETFs",
    balance: "$15,230.80",
    type: "investment",
  },
  {
    id: "4",
    title: "Credit Card",
    description: "Pending charges",
    balance: "$1,200.00",
    type: "debt",
  },
  {
    id: "5",
    title: "Savings Account",
    description: "Emergency fund",
    balance: "$3,000.00",
    type: "savings",
  },
];

export function SchoolFeed({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle> School Feed </CardTitle>
        <CardDescription className="text-xs">
          Stay updated with grades, deadlines, and announcements
        </CardDescription>
        <CardAction>
          <Button variant={"link"} className="text-xs">
            Read more
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="gap-3 px-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={cn(
              "group flex items-center justify-between",
              "rounded-lg p-2",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
              "transition-all duration-200",
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn("rounded-lg p-1.5", {
                  "bg-emerald-100 dark:bg-emerald-900/30":
                    account.type === "savings",
                  "bg-blue-100 dark:bg-blue-900/30":
                    account.type === "checking",
                  "bg-purple-100 dark:bg-purple-900/30":
                    account.type === "investment",
                })}
              >
                {account.type === "savings" && (
                  <Wallet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
                {account.type === "checking" && (
                  <QrCode className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                )}
                {account.type === "investment" && (
                  <ArrowUpRight className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                )}
                {account.type === "debt" && (
                  <CreditCard className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {account.title}
                </h3>
                {account.description && (
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    {account.description}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {account.balance}
              </span>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Updated footer with four buttons */}
      {/* <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200"
            )}
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200"
            )}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Top-up</span>
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200"
            )}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>
      </div> */}
    </Card>
  );
}
