import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import type { RouterOutputs } from "@repo/api";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { ContactGradeList } from "./ContactGradeList";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contactId = params.id;
  const queryClient = getQueryClient();
  const studentContacts = await queryClient.fetchQuery(
    trpc.contact.students.queryOptions(contactId),
  );
  const allgrades: RouterOutputs["student"]["grades"] = [];
  for (const std of studentContacts) {
    const grades = await queryClient.fetchQuery(
      trpc.student.grades.queryOptions({ id: std.studentId }),
    );
    allgrades.push(...grades);
  }
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid-cols grid">
              <Skeleton className="h-20" />
            </div>
          }
        >
          <ContactGradeList
            studentContacts={studentContacts}
            grades={allgrades}
          />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
