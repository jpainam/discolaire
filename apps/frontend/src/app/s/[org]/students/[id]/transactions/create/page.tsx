import type { SearchParams } from "nuqs/server";
import { notFound } from "next/navigation";



import { Step1 } from "~/components/students/transactions/create/step1";
import { Step2 } from "~/components/students/transactions/create/step2";
import { caller } from "~/trpc/server";
import { createTransactionLoader } from "~/utils/search-params";


interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;

  const searchParams = await createTransactionLoader(props.searchParams);
  const unpaidRequiredFees = await caller.student.unpaidRequiredFees(params.id);
  const classroom = await caller.student.classroom( {studentId: params.id});
  const student = await caller.student.get(params.id);
    const transactions = await caller.student.transactions(params.id);
  if (!classroom) {
      return (
       <></>
      );
    }
  const fees = await caller.classroom.fees(params.id);
  const studentContacts = await caller.student.contacts(params.id);
  if (searchParams.step === "step1") {
    return (
      <Step1 unpaidRequiredFees={unpaidRequiredFees} studentId={params.id} />
    );
  } else if (searchParams.step === "step2") {
    return (
      <Step2
        studentContacts={studentContacts}
        fees={fees}
        classroom={classroom}
        transactions={transactions}
        student={student}
      />
    );
  } else {
    notFound();
  }
}