import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { DocumentOverview } from "~/components/documents/DocumentOverview";
import { ErrorFallback } from "~/components/error-fallback";
import { StudentDocumentHeader } from "~/components/students/documents/StudentDocumentHeader";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(params.id),
  );

  batchPrefetch([trpc.student.documents.queryOptions(params.id)]);
  const t = await getTranslations();

  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("student"), href: "/students" },
          { label: getFullName(student), href: `/students/${student.id}` },
          { label: t("documents") },
        ]}
      />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <StudentDocumentHeader studentId={student.id} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid gap-4 px-4 py-2 md:grid-cols-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          }
        >
          <DocumentOverview entityId={student.id} entityType="student" />
          {/* <StudentDocumentTable studentId={student.id} /> */}
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
