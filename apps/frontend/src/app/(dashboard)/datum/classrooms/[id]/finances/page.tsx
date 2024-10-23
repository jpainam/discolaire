import { sumBy } from "lodash";

import { FinanceContentView } from "~/components/classrooms/finances/FinanceContentView";
import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
  searchParams: { query },
}: {
  params: { id: string };
  searchParams: { query: string };
}) {
  const fees = await api.classroom.fees(id);
  const balances = await api.classroom.studentsBalance({ id });

  const students = !query
    ? balances
    : balances.filter(
        (balance) =>
          balance.student.firstName
            ?.toLowerCase()
            .includes(query.toLowerCase()) ??
          balance.student.lastName
            ?.toLowerCase()
            .includes(query.toLowerCase()) ??
          balance.student.email?.toLowerCase().includes(query.toLowerCase()) ??
          (!isNaN(Number(query)) && balance.balance >= Number(query)),
      );

  const amountDue = sumBy(
    fees.filter((fee) => fee.dueDate <= new Date()),
    "amount",
  );
  return <FinanceContentView amountDue={amountDue} students={students} />;
}
