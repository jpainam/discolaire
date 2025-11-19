import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { SignUpContact } from "~/components/students/contacts/SignUpContact";
import { StudentContactHeader } from "~/components/students/contacts/StudentContactHeader";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Contacts",
};

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { children } = props;
  //const studentContacts = await caller.student.contacts(params.id);
  prefetch(trpc.student.contacts.queryOptions(params.id));

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <StudentContactHeader />
        </Suspense>
      </ErrorBoundary>
      <Separator />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-20" />
            </div>
          }
        >
          <SignUpContact />
        </Suspense>
      </ErrorBoundary>
      <Suspense
        fallback={
          <div className="grid grid-cols-3 gap-4 px-4 py-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton key={index} className="h-8" />
            ))}
          </div>
        }
      >
        <StudentContactTable
          //studentContacts={studentContacts}
          className="px-4"
          studentId={params.id}
        />
      </Suspense>
      {children}
    </HydrateClient>
  );
}
