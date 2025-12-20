import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { createLoader, parseAsString } from "nuqs/server";

import { TermType } from "@repo/db/enums";

import { CheckSubjectScale } from "~/components/classrooms/reportcards/CheckSubjectScaleTerm";
import { ReportCardAppreciation } from "~/components/classrooms/reportcards/ReportCardAppreciation";
import { ReportCardClassroomCouncil } from "~/components/classrooms/reportcards/ReportCardClassroomCouncil";
import { ReportCardMontly } from "~/components/classrooms/reportcards/ReportCardMonthly";
import { ReportCardQuarter } from "~/components/classrooms/reportcards/ReportCardQuarter";
import { ReportCardSkillAcquisition } from "~/components/classrooms/reportcards/ReportCardSkillAcquisition";
import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}
const searchSchema = {
  termId: parseAsString,
  action: parseAsString,
};
const reportCardSearchParams = createLoader(searchSchema);
export default async function Page(props: PageProps) {
  const params = await props.params;
  const searchParams = await reportCardSearchParams(props.searchParams);

  batchPrefetch([
    trpc.classroom.get.queryOptions(params.id),
    trpc.classroom.subjects.queryOptions(params.id),
    trpc.classroom.students.queryOptions(params.id),
    trpc.classroom.gradesheets.queryOptions(params.id),
    trpc.appreciation.categories.queryOptions(),
  ]);

  if (!searchParams.termId) {
    return (
      <EmptyComponent
        title="Veuillez choisir une période"
        description="Choisissez une période pour commencer"
      />
    );
  }
  const queryClient = getQueryClient();
  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(params.id),
  );
  const { termId, action } = searchParams;
  const term = await queryClient.fetchQuery(trpc.term.get.queryOptions(termId));

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <CheckSubjectScale
            term={term}
            classroomId={params.id}
            subjects={subjects}
          />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={`${termId}-${action}`}
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 12 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          }
        >
          {action == "skills" && (
            <ReportCardSkillAcquisition
              classroomId={params.id}
              termId={termId}
            />
          )}
          {action == "subjects" && (
            <ReportCardAppreciation classroomId={params.id} termId={termId} />
          )}
          {action == "class_council" && (
            <ReportCardClassroomCouncil
              classroomId={params.id}
              termId={termId}
            />
          )}
          {action == "reportcard" && term.type == TermType.MONTHLY && (
            <ReportCardMontly
              termId={termId}
              subjects={subjects}
              classroomId={params.id}
            />
          )}
          {action == "reportcard" && term.type == TermType.QUARTER && (
            <ReportCardQuarter classroomId={params.id} term={term} />
          )}
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
