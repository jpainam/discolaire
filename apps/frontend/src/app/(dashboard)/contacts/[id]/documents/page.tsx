import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { DocumentOverview } from "~/components/documents/DocumentOverview";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient } from "~/trpc/server";
import { ContactDocumentHeader } from "./ContactDocumentHeader";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contactId = params.id;
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <ContactDocumentHeader contactId={contactId} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <DocumentOverview entityId={contactId} entityType="contact" />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
