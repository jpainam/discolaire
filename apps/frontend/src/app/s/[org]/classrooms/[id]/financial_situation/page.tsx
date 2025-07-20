import { sumBy } from "lodash";

import { getSession } from "~/auth/server";
import { ClassroomFinancialSituation } from "~/components/classrooms/finances/ClassroomFinancialSituation";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const fees = await caller.classroom.fees(id);
  let balances = await caller.classroom.studentsBalance({ id });
  const session = await getSession();
  if (session?.user.profile == "student") {
    const student = await caller.student.getFromUserId(session.user.id);
    balances = balances.filter((balance) => balance.studentId === student.id);
  } else if (session?.user.profile == "contact") {
    const contact = await caller.contact.getFromUserId(session.user.id);
    const students = await caller.contact.students(contact.id);
    const studentIds = students.map((student) => student.studentId);
    balances = balances.filter((balance) =>
      studentIds.includes(balance.studentId),
    );
  }

  const amountDue = sumBy(
    fees.filter((fee) => fee.dueDate <= new Date()),
    "amount",
  );

  return (
    <ClassroomFinancialSituation amountDue={amountDue} balances={balances} />
  );
}
