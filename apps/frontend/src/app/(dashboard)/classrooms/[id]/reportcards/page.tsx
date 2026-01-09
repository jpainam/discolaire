import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { createLoader, parseAsString } from "nuqs/server";

import { TermType } from "@repo/db/enums";

import { CheckReportCard } from "~/components/classrooms/reportcards/CheckSubjectScaleTerm";
import { ReportCardAnnual } from "~/components/classrooms/reportcards/ReportCardAnnual";
import { ReportCardClassroomCouncil } from "~/components/classrooms/reportcards/ReportCardClassroomCouncil";
import { ReportCardMontly } from "~/components/classrooms/reportcards/ReportCardMonthly";
import { ReportCardOverallAppreciation } from "~/components/classrooms/reportcards/ReportCardOverallAppreciation";
import { ReportCardQuarter } from "~/components/classrooms/reportcards/ReportCardQuarter";
import { ReportCardSkillAcquisition } from "~/components/classrooms/reportcards/ReportCardSkillAcquisition";
import { ReportCardSubjectRemark } from "~/components/classrooms/reportcards/ReportCardSubjectRemark";
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
  subjectId: parseAsString,
  action: parseAsString,
};
const reportCardSearchParams = createLoader(searchSchema);
export default async function Page(props: PageProps) {
  const params = await props.params;
  const searchParams = await reportCardSearchParams(props.searchParams);

  if (!searchParams.termId) {
    return (
      <EmptyComponent
        title="Veuillez choisir une période"
        description="Choisissez une période pour commencer"
      />
    );
  }
  const queryClient = getQueryClient();
  const { termId, action } = searchParams;
  const classroomId = params.id;
  const term = await queryClient.fetchQuery(trpc.term.get.queryOptions(termId));
  batchPrefetch([
    trpc.classroom.get.queryOptions(classroomId),
    trpc.classroom.subjects.queryOptions(classroomId),
    trpc.classroom.students.queryOptions(classroomId),
    trpc.classroom.gradesheets.queryOptions(classroomId),
    trpc.skillAcquisition.all.queryOptions({ classroomId, termId }),
    trpc.appreciation.categories.queryOptions(),
    ...(searchParams.subjectId != null
      ? [trpc.subject.get.queryOptions(searchParams.subjectId)]
      : []),
    term.type == TermType.MONTHLY
      ? trpc.reportCard.getSequence.queryOptions({
          classroomId,
          termId,
        })
      : term.type == TermType.ANNUAL
        ? trpc.reportCard.getAnnualReport.queryOptions({
            classroomId,
            termId,
          })
        : trpc.reportCard.getTrimestre.queryOptions({
            classroomId,
            termId,
          }),
  ]);

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
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4 p-4">
                  {Array.from({ length: 12 }).map((_, t) => (
                    <Skeleton className="h-20" key={t} />
                  ))}
                </div>
              }
            >
              <ReportCardSkillAcquisition classroomId={params.id} term={term} />
            </Suspense>
          )}
          {action == "subjects" && searchParams.subjectId && (
            <ReportCardSubjectRemark
              classroomId={classroomId}
              termId={termId}
              subjectId={searchParams.subjectId}
            />
          )}
          {action == "class_council" && (
            <ReportCardClassroomCouncil
              classroomId={params.id}
              termId={termId}
            />
          )}
          {action == "overall_appreciation" && (
            <ReportCardOverallAppreciation
              classroomId={params.id}
              termId={termId}
            />
          )}
          {action == "reportcard" && term.type == TermType.MONTHLY && (
            <ReportCardMontly
              termId={termId}
              subjects={subjects}
              classroomId={classroomId}
            />
          )}
          {action == "reportcard" && term.type == TermType.QUARTER && (
            <ReportCardQuarter classroomId={classroomId} term={term} />
          )}
          {action == "reportcard" && term.type == TermType.ANNUAL && (
            <ReportCardAnnual
              subjects={subjects}
              classroomId={classroomId}
              term={term}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
