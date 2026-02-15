import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createLoader, parseAsInteger } from "nuqs/server";

import { getSession } from "~/auth/server";
import { CreateEditProgram } from "~/components/classrooms/programs/CreateEditProgram";
import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { SubjectJournalEditor } from "./sessions/SubjectJournalEditor";
import { SubjectJournalHeader } from "./sessions/SubjectJournalHeader";
import { SubjectJournalList } from "./sessions/SubjectJournalList";
import { TeachingSessionCoverage } from "./TeachingSessionCoverage";

const programSchema = {
  subjectId: parseAsInteger,
};
interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}
const programSearchParamsLoader = createLoader(programSchema);
export default async function Page(props: PageProps) {
  const params = await props.params;
  const searchParams = await programSearchParamsLoader(props.searchParams);
  const session = await getSession();

  const t = await getTranslations();
  const subjectId = searchParams.subjectId;

  if (subjectId == null) {
    const queryClient = getQueryClient();
    const subjects = await queryClient.fetchQuery(
      trpc.classroom.subjects.queryOptions(params.id),
    );
    const firstSubject = subjects[0];

    if (firstSubject) {
      redirect(
        `/classrooms/${params.id}/teaching_session?subjectId=${firstSubject.id.toString()}`,
      );
    }

    return (
      <EmptyComponent
        title={"Selectionner une matière"}
        description="Commencer par séléctionner une matière à gauche"
      />
    );
  }

  return (
    <Tabs defaultValue="teaching_session">
      <TabsList>
        <TabsTrigger value="teaching_session">
          {t("teaching_session")}
        </TabsTrigger>
        <TabsTrigger value="program_coverage">
          {t("course_coverage")}
        </TabsTrigger>
        <TabsTrigger value="program">{t("Program")}</TabsTrigger>
      </TabsList>
      <TabsContent value="teaching_session">
        <HydrateClient>
          {session?.user.profile == "staff" && (
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 gap-2 px-4 py-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-10" />
                    ))}
                  </div>
                }
              >
                <SubjectJournalHeader
                  type="teaching_session"
                  defaultSubjectId={subjectId}
                />
                <SubjectJournalEditor defaultSubjectId={subjectId} />
              </Suspense>
              <Separator />
            </ErrorBoundary>
          )}

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4 px-4 py-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              }
            >
              <SubjectJournalList defaultSubjectId={subjectId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </TabsContent>
      <TabsContent value="program_coverage">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 px-4 py-2">
                <Skeleton className="h-20 w-1/4" />
                <Skeleton className="h-20 w-1/4" />
                <Skeleton className="h-20 w-1/4" />
                <Skeleton className="h-20 w-1/4" />
              </div>
            }
          >
            <SubjectJournalHeader
              type="program_coverage"
              defaultSubjectId={subjectId}
            />
            <TeachingSessionCoverage defaultSubjectId={subjectId} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
      <TabsContent value="program">
        <>
          <SubjectJournalHeader type="program" defaultSubjectId={subjectId} />
          <CreateEditProgram defaultSubjectId={subjectId} />
        </>
      </TabsContent>
    </Tabs>
  );
}
