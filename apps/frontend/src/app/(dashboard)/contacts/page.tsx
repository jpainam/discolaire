import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";

import { getSession } from "~/auth/server";
import { ContactDataTable } from "~/components/contacts/ContactDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { ContactHeader } from "./ContactHeader";

export default async function Page() {
  prefetch(trpc.contact.search.queryOptions({ query: "", limit: 20 }));
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  //const { user } = session;

  // const canReadContact = await checkPermission(
  //   "contact",
  //   "read"
  // );

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <ContactHeader />
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <div className="px-4">
            <ContactDataTable />
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
