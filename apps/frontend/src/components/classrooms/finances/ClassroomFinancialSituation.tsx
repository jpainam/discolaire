"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { RouterOutputs } from "@repo/api";
import { GridViewFinanceCard } from "./GridViewFinanceCard";
import { ListViewFinance } from "./ListViewFinance";

import { GridViewFinanceCard } from "./GridViewFinanceCard";
import { ListViewFinance } from "./ListViewFinance";

export function ClassroomFinancialSituation({
  balances,
  amountDue,
}: {
  balances: RouterOutputs["classroom"]["studentsBalance"];
  amountDue: number;
}) {
  const searchParams = useSearchParams();

  const view = searchParams.get("view") ?? "grid";
  const type = searchParams.get("type") ?? "all";

  return (
    <div>
      {view === "list" ? (
        <ListViewFinance
          type={type}
          amountDue={amountDue}
          students={balances}
        />
      ) : (
        <div className="grid gap-4 p-2 text-sm md:grid-cols-2 xl:md:grid-cols-3">
          {balances.map((balance) => {
            return (
              <GridViewFinanceCard
                type={type}
                amountDue={amountDue}
                studentBalance={balance}
                key={balance.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
