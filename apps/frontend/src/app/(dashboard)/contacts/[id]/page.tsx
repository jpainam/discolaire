import { getTranslations } from "next-intl/server";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { ContactRecentTransactions } from "./ContactRecentTransactions";
import { ContactStudentOverview } from "./ContactStudentOverview";
import { StatCards } from "./StatCards";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const contactId = params.id;

  batchPrefetch([
    trpc.contact.get.queryOptions(contactId),
    trpc.contact.students.queryOptions(contactId),
    trpc.contact.transactions.queryOptions(contactId),
    trpc.contact.studentOverview.queryOptions(contactId),
  ]);
  const t = await getTranslations();
  //const locale = await getLocale();
  const queryClient = getQueryClient();
  const studentContacts = await queryClient.fetchQuery(
    trpc.contact.students.queryOptions(contactId),
  );

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid gap-4 p-4 xl:grid-cols-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          }
        >
          <StatCards />
        </Suspense>
      </ErrorBoundary>
      <div className="grid gap-4 px-4 lg:grid-cols-2">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <ContactStudentOverview contactId={contactId} />
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-50" />}>
            <ContactRecentTransactions contactId={contactId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
