import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ContactStudentList } from "~/components/contacts/ContactStudentList";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const contactId = params.id;
  batchPrefetch([
    trpc.contact.students.queryOptions(contactId),
    trpc.contact.get.queryOptions(contactId),
  ]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 p-4">
              <Skeleton className="h-40" />
            </div>
          }
        >
          <ContactStudentList contactId={contactId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
