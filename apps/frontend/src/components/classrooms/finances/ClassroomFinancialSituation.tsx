"use client";

import { parseAsString, useQueryState } from "nuqs";



import type { RouterOutputs } from "@repo/api";



import { GridViewFinanceCard } from "./GridViewFinanceCard";
import { ListViewFinance } from "./ListViewFinance";


export function ClassroomFinancialSituation({
  balances,
  fees,
}: {
  balances: RouterOutputs["classroom"]["studentsBalance"];
  fees: RouterOutputs['classroom']['fees'];
}) {
  const [view] = useQueryState("view", parseAsString.withDefault("grid"));
  const [situation] = useQueryState(
    "situation",
    parseAsString.withDefault("all"),
  );

  const amountDueByJournal = fees.reduce<Record<string, number>>((acc, fee) => {
    const key = fee.journalId ?? "unknown"; 
    if (fee.dueDate <= new Date()) {
      acc[key] = (acc[key] ?? 0) + fee.amount;
    }
    return acc;
  }, {});


  return (
    <div>
      {view === "list" ? (
        <ListViewFinance
          type={situation}
          amountDue={amountDueByJournal}
          students={balances}
        />
      ) : (
        <div className="grid gap-4 p-2 text-sm md:grid-cols-2 xl:md:grid-cols-3">
          {balances.map((balance, index) => {
            return (
              <GridViewFinanceCard
                type={situation}
                amountDue={amountDueByJournal}
                studentBalance={balance}
                key={index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}