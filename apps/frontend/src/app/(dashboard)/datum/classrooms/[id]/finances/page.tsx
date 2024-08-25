import { GridViewFinanceCard } from "@/components/classrooms/finances/GridViewFinanceCard";
import { ListViewFinance } from "@/components/classrooms/finances/ListViewFinance";

import { api } from "@/trpc/server";
import { sumBy } from "lodash";

export default async function Page({
  params: { id },
  searchParams: { query, view },
}: {
  params: { id: string };
  searchParams: { query: string; view: string };
}) {
  const fees = await api.classroom.fees(id);
  const balances = await api.classroom.studentsBalance({ id });

  const students = !query
    ? balances
    : balances.filter(
        (balance) =>
          balance.student?.firstName
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          balance.student?.lastName
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          balance.student?.email?.toLowerCase().includes(query.toLowerCase()) ||
          (!isNaN(Number(query)) && balance.balance >= Number(query))
      );

  const amountDue = sumBy(
    fees.filter((fee) => (fee.dueDate ? fee.dueDate <= new Date() : false)),
    "amount"
  );
  return (
    <>
      {view === "list" ? (
        <ListViewFinance amountDue={amountDue} students={students} />
      ) : (
        <div className="text-sm grid md:grid-cols-2 xl:md:grid-cols-3 gap-4 p-2">
          {students.map((balance) => {
            return (
              balance.student && (
                <GridViewFinanceCard
                  amountDue={amountDue}
                  studentBalance={balance}
                  key={balance.id}
                />
              )
            );
          })}
        </div>
      )}
    </>
  );
}
