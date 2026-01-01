import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { Step1 } from "~/components/students/transactions/create/step1";
import { Step2 } from "~/components/students/transactions/create/step2";
import { getQueryClient, trpc } from "~/trpc/server";
import { createTransactionLoader } from "~/utils/search-params";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const t = await getTranslations();
  const queryClient = getQueryClient();

  const searchParams = await createTransactionLoader(props.searchParams);
  const unpaidRequiredFees = await queryClient.fetchQuery(
    trpc.student.unpaidRequiredFees.queryOptions(params.id),
  );
  const classroom = await queryClient.fetchQuery(
    trpc.student.classroom.queryOptions({ studentId: params.id }),
  );
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(params.id),
  );
  const transactions = await queryClient.fetchQuery(
    trpc.student.transactions.queryOptions(params.id),
  );
  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }
  let fees = await queryClient.fetchQuery(
    trpc.classroom.fees.queryOptions(classroom.id),
  );
  const studentContacts = await queryClient.fetchQuery(
    trpc.student.contacts.queryOptions(params.id),
  );
  const journals = await queryClient.fetchQuery(
    trpc.accountingJournal.all.queryOptions(),
  );
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
