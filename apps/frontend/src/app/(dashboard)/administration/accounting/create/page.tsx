import type { SearchParams } from "nuqs/server";
import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { CreateTransactionContextProvider } from "~/components/students/transactions/create/CreateTransactionContextProvider";
import { getQueryClient, trpc } from "~/trpc/server";
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
  const t = await getTranslations();
  const queryClient = getQueryClient();

  const classroom = await queryClient.fetchQuery(
    trpc.student.classroom.queryOptions({ studentId }),
  );
  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }
  const studentContacts = await queryClient.fetchQuery(
    trpc.student.contacts.queryOptions(studentId),
  );
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(studentId),
  );
  const fees = await queryClient.fetchQuery(
    trpc.classroom.fees.queryOptions(classroom.id),
  );
  const unpaidRequiredFees = await queryClient.fetchQuery(
    trpc.student.unpaidRequiredFees.queryOptions(studentId),
  );
  const transactions = await queryClient.fetchQuery(
    trpc.student.transactions.queryOptions(studentId),
  );

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
