import { auth } from "@repo/auth";
import { sumBy } from "lodash";

import { FinanceContentView } from "~/components/classrooms/finances/FinanceContentView";
import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query: string }>;
}) {
  const searchParams = await props.searchParams;

  const { query } = searchParams;

  const params = await props.params;

  const { id } = params;

  const fees = await api.classroom.fees(id);
  let balances = await api.classroom.studentsBalance({ id });
  const session = await auth();
  if (session?.user.profile == "student") {
    const student = await api.student.getFromUserId(session.user.id);
    balances = balances.filter((balance) => balance.student.id === student.id);
  } else if (session?.user.profile == "contact") {
    const contact = await api.contact.getFromUserId(session.user.id);
    const students = await api.contact.students(contact.id);
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
  return <FinanceContentView amountDue={amountDue} students={students} />;
}
