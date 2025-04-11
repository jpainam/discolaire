import { auth } from "@repo/auth";
import { sumBy } from "lodash";

import { GridViewFinanceCard } from "~/components/classrooms/finances/GridViewFinanceCard";
import { ListViewFinance } from "~/components/classrooms/finances/ListViewFinance";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query?: string; view?: string }>;
}) {
  const searchParams = await props.searchParams;

  const { query } = searchParams;

  const params = await props.params;

  const { id } = params;

  const fees = await caller.classroom.fees(id);
  let balances = await caller.classroom.studentsBalance({ id });
  const session = await auth();
  if (session?.user.profile == "student") {
    const student = await caller.student.getFromUserId(session.user.id);
    balances = balances.filter((balance) => balance.student.id === student.id);
  } else if (session?.user.profile == "contact") {
    const contact = await caller.contact.getFromUserId(session.user.id);
    const students = await caller.contact.students(contact.id);
    const studentIds = students.map((student) => student.studentId);
    balances = balances.filter((balance) =>
      studentIds.includes(balance.student.id),
    );
  }

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
  const view = searchParams.view ?? "grid";
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
