"use client";

import { useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import { GridViewFinanceCard } from "./GridViewFinanceCard";
import { ListViewFinance } from "./ListViewFinance";

export function FinanceContentView({
  amountDue,
  students,
}: {
  amountDue: number;
  students: RouterOutputs["classroom"]["studentsBalance"];
}) {
  const [view, _] = useQueryState("view");
  return (
    <div>
      {view === "list" ? (
        <ListViewFinance amountDue={amountDue} students={students} />
      ) : (
        <div className="grid gap-4 p-2 text-sm md:grid-cols-2 xl:md:grid-cols-3">
          {students.map((balance) => {
            return (
              <GridViewFinanceCard
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
