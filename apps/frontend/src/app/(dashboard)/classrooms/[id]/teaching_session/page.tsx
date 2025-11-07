import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { createLoader, parseAsInteger } from "nuqs/server";

import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { getSession } from "~/auth/server";
import { CreateEditProgram } from "~/components/classrooms/programs/CreateEditProgram";
import { ErrorFallback } from "~/components/error-fallback";
import { getServerTranslations } from "~/i18n/server";
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

  const { id } = params;
  const session = await getSession();

  const { t } = await getServerTranslations();
  const queryClient = getQueryClient();
  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(id),
  );

  const subjectId = searchParams.subjectId ?? subjects[0]?.id;
  //const categories = await queryClient.fetchQuery(trpc.term.all.queryOptions());

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
          {subjectId && session?.user.profile == "staff" && (
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
                <SubjectJournalHeader defaultSubjectId={subjectId} />
                <SubjectJournalEditor defaultSubjectId={subjectId} />
              </Suspense>
              <Separator />
            </ErrorBoundary>
          )}

          {subjectId && (
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
          )}
        </HydrateClient>
      </TabsContent>
      <TabsContent value="program_coverage">
        {subjectId && (
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
              <TeachingSessionCoverage defaultSubjectId={subjectId} />
            </Suspense>
          </ErrorBoundary>
        )}
      </TabsContent>
      <TabsContent value="program">
        {subjectId && <CreateEditProgram defaultSubjectId={subjectId} />}
      </TabsContent>
    </Tabs>
  );
}
