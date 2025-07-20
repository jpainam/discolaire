import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";

import { Skeleton } from "@repo/ui/components/skeleton";

import { getSession } from "~/auth/server";
import { ContactDataTable } from "~/components/contacts/ContactDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { ContactHeader } from "./ContactHeader";
import { ContactSearchPage } from "./ContactSearchPage";

export default async function Page() {
  prefetch(trpc.contact.all.queryOptions());
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const { user } = session;

  // const canReadContact = await checkPermission(
  //   "contact",
  //   PermissionAction.READ
  // );

  return (
    <HydrateClient>
      <ContactHeader />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={"contacts"}
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          {user.profile != "staff" ? (
            <div className="px-4 py-4">
              <ContactDataTable />
            </div>
          ) : (
            <ContactSearchPage />
          )}
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
