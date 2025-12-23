import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
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
  const t = await getTranslations();

  const searchParams = await createTransactionLoader(props.searchParams);
  const unpaidRequiredFees = await caller.student.unpaidRequiredFees(params.id);
  const classroom = await caller.student.classroom({ studentId: params.id });
  const student = await caller.student.get(params.id);
  const transactions = await caller.student.transactions(params.id);
  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }
  let fees = await caller.classroom.fees(classroom.id);
  const studentContacts = await caller.student.contacts(params.id);
  const journals = await caller.accountingJournal.all();
  if (unpaidRequiredFees.unpaid == 0) {
    fees = fees.filter(
      (j) =>
        j.journalId && !unpaidRequiredFees.journalIds.includes(j.journalId),
    );
  }
  const journalIdsFromFees = fees.map((fee) => fee.journalId);
  const defaultJournalId =
    journalIdsFromFees.length > 0 ? journalIdsFromFees[0] : journals[0]?.id;
  if (searchParams.step === "step2") {
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
    return (
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Step1
          defaultJournalId={defaultJournalId ?? ""}
          journals={journals.filter((j) => journalIdsFromFees.includes(j.id))}
          unpaidRequiredFees={unpaidRequiredFees}
          studentId={params.id}
        />
      </ErrorBoundary>
    );
  }
}
