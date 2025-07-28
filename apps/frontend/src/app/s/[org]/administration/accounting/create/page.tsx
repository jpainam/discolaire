import type { SearchParams } from "nuqs/server";

import { EmptyState } from "~/components/EmptyState";
import { CreateTransactionContextProvider } from "~/components/students/transactions/create/CreateTransactionContextProvider";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";
import { createTransactionSearchParams } from "~/utils/search-params";
import { CreateStudentTransaction } from "./CreateStudentTransaction";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await createTransactionSearchParams(props.searchParams);

  if (!searchParams.studentId) {
    return <CreateStudentTransaction studentId={searchParams.studentId} />;
  }
  const studentId = searchParams.studentId;
  const { t } = await getServerTranslations();

  const classroom = await caller.student.classroom({ studentId });
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  const studentContacts = await caller.student.contacts(studentId);
  const student = await caller.student.get(studentId);
  const fees = await caller.classroom.fees(classroom.id);
  const unpaidRequiredFees = await caller.student.unpaidRequiredFees(studentId);
  const transactions = await caller.student.transactions(studentId);

  return (
    <div className="flex flex-col gap-4 py-4">
      <CreateStudentTransaction
        studentId={searchParams.studentId}
        fullName={getFullName(student)}
      />
      <div className="flex flex-col items-center justify-center text-lg font-bold">
        {getFullName(student)}
      </div>
      <CreateTransactionContextProvider
        studentContacts={studentContacts}
        transactions={transactions}
        fees={fees}
        student={student}
        unpaidRequiredFees={unpaidRequiredFees}
        classroom={classroom}
      >
        <div>En cours de modification</div>
      </CreateTransactionContextProvider>
    </div>
  );
}
