import { sumBy } from "lodash";

import { getSession } from "~/auth/server";
import { ClassroomFinancialSituation } from "~/components/classrooms/finances/ClassroomFinancialSituation";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ journal: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  if (!searchParams.journal) {
    return (
      <div className="my-8 flex items-center justify-center">
        Veuillez selectionner un journal
      </div>
    );
  }
  const { id } = params;

  const fees = (await caller.classroom.fees(id)).filter(
    (fee) => fee.journalId === searchParams.journal,
  );
  let balances = await caller.classroom.studentsBalance({
    id,
    journalId: searchParams.journal,
  });
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
