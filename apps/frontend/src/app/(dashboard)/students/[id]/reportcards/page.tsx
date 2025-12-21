import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { TermType } from "@repo/db/enums";

import { CheckReportCard } from "~/components/classrooms/reportcards/CheckSubjectScaleTerm";
import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { StudentReportCardMontly } from "~/components/students/reportcards/StudentReportCardMonthly";
import { StudentReportCardQuarter } from "~/components/students/reportcards/StudentReportCardQuarter";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { reportcardSearchParams } from "~/utils/search-params";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const t = await getTranslations();
  const { id } = params;
  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(id),
  );
  const classroomId = student.classroom?.id;
  if (!classroomId) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }

  const { termId } = await reportcardSearchParams(props.searchParams);

  if (!termId) {
    return (
      <EmptyComponent
        title="Veuillez choisir une période"
        description="Choisissez une période ou un trimestre pour commencer"
      />
    );
  }
  const term = await queryClient.fetchQuery(trpc.term.get.queryOptions(termId));
  batchPrefetch([
    trpc.reportCard.getSequence.queryOptions({
      classroomId,
      termId,
    }),
    term.type == TermType.MONTHLY
      ? trpc.discipline.sequence.queryOptions({
          classroomId,
          termId,
        })
      : trpc.reportCard.getTrimestre.queryOptions({
          classroomId,
          termId,
        }),
  ]);

  const classroom = await queryClient.fetchQuery(
    trpc.classroom.get.queryOptions(classroomId),
  );

  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-20 w-full" />}>
          <CheckReportCard
            term={term}
            classroomId={params.id}
            subjects={subjects}
          />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={termId}
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 12 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          }
        >
          {term.type == TermType.MONTHLY && (
            <StudentReportCardMontly
              term={term}
              student={student}
              subjects={subjects}
              classroom={classroom}
            />
          )}
          {term.type == TermType.QUARTER && (
            <StudentReportCardQuarter
              term={term}
              subjects={subjects}
              student={student}
              classroom={classroom}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
