"use client";

import { useMemo, useState } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { CreateTransactionContextProvider } from "~/components/students/transactions/create/CreateTransactionContextProvider";
import { Step1 } from "~/components/students/transactions/create/step1";
import { Step2 } from "~/components/students/transactions/create/step2";
import { useTRPC } from "~/trpc/react";

export function StudentTransactionCreate() {
  const params = useParams<{ id: string }>();
  const studentId = params.id;
  const t = useTranslations();
  const trpc = useTRPC();

  const { data: classroom } = useSuspenseQuery(
    trpc.student.classroom.queryOptions({ studentId }),
  );

  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }

  return <CreateTransactionData classroom={classroom} studentId={studentId} />;
}

function CreateTransactionData({
  classroom,
  studentId,
}: {
  classroom: NonNullable<RouterOutputs["student"]["classroom"]>;
  studentId: string;
}) {
  const trpc = useTRPC();
  const [step, setStep] = useState<"step1" | "step2">("step1");

  const { data: unpaidRequiredFees } = useSuspenseQuery(
    trpc.student.unpaidRequiredFees.queryOptions(studentId),
  );
  const { data: student } = useSuspenseQuery(
    trpc.student.get.queryOptions(studentId),
  );
  const { data: transactions } = useSuspenseQuery(
    trpc.student.transactions.queryOptions(studentId),
  );
  const { data: studentContacts } = useSuspenseQuery(
    trpc.student.contacts.queryOptions(studentId),
  );
  const { data: fees } = useSuspenseQuery(
    trpc.classroom.fees.queryOptions(classroom.id),
  );
  const { data: journals } = useSuspenseQuery(
    trpc.accountingJournal.all.queryOptions(),
  );

  const filteredFees = useMemo(() => {
    if (unpaidRequiredFees.unpaid == 0) {
      return fees.filter(
        (fee) =>
          fee.journalId &&
          !unpaidRequiredFees.journalIds.includes(fee.journalId),
      );
    }
    return fees;
  }, [fees, unpaidRequiredFees.journalIds, unpaidRequiredFees.unpaid]);

  const journalIdsFromFees = useMemo(
    () => filteredFees.map((fee) => fee.journalId).filter(Boolean),
    [filteredFees],
  );

  const defaultJournalId =
    journalIdsFromFees.length > 0 ? journalIdsFromFees[0] : journals[0]?.id;

  return (
    <CreateTransactionContextProvider
      fees={filteredFees}
      classroom={classroom}
      studentContacts={studentContacts}
      transactions={transactions}
      student={student}
      unpaidRequiredFees={unpaidRequiredFees}
    >
      {step === "step1" ? (
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Step1
            defaultJournalId={defaultJournalId ?? ""}
            journals={journals.filter((journal) =>
              journalIdsFromFees.includes(journal.id),
            )}
            unpaidRequiredFees={unpaidRequiredFees}
            onNextAction={() => setStep("step2")}
          />
        </ErrorBoundary>
      ) : (
        <Step2 onPrevAction={() => setStep("step1")} />
      )}
    </CreateTransactionContextProvider>
  );
}
