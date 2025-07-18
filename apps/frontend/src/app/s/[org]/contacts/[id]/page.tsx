import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { ContactDetails } from "~/components/contacts/ContactDetails";
import { ContactDetailsHeader } from "~/components/contacts/ContactDetailsHeader";
import { ContactStudentTable } from "~/components/contacts/ContactStudentTable";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  batchPrefetch([
    trpc.contact.get.queryOptions(id),
    trpc.contact.students.queryOptions(id),
  ]);

  return (
    <HydrateClient>
      <div className="grid gap-4 py-2 px-4 xl:grid-cols-[40%_58%]">
        <Card className="p-0">
          <CardHeader className="border-b bg-muted/50 p-2">
            <ContactDetailsHeader />
          </CardHeader>
          <CardContent className="p-4 text-sm">
            <ContactDetails contactId={id} />
          </CardContent>
        </Card>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={params.id}
            fallback={
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-8" />
                ))}
              </div>
            }
          >
            <ContactStudentTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
