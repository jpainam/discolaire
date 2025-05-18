import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { checkPermission } from "@repo/api/permission";
import { auth } from "@repo/auth";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import StudentDetails from "~/components/students/profile/StudentDetails";
import { batchPrefetch, caller, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  //const queryClient = getQueryClient();

  const student = await caller.student.get(params.id);
  // https://trpc.io/docs/client/tanstack-react-query/server-components
  // const student = await queryClient.fetchQuery(
  //   trpc.student.get.queryOptions(params.id)
  // );

  const session = await auth();
  let canReadContacts =
    session?.user.profile === "student" && session.user.id === student.userId;

  if (session?.user.profile === "staff") {
    const canReadStudent = await checkPermission(
      "student",
      PermissionAction.READ,
    );
    if (!canReadStudent) {
      return <NoPermission className="my-8" />;
    }
    canReadContacts = await checkPermission("student", PermissionAction.READ);
  }

  batchPrefetch([
    trpc.student.siblings.queryOptions(params.id),
    trpc.student.get.queryOptions(params.id),
    trpc.student.contacts.queryOptions(params.id),
  ]);

  await caller.logActivity.create({
    title: "Student Profile",
    type: "READ",
    url: `/students/${params.id}`,
    entityId: params.id,
    entityType: "student",
  });

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid grid-cols-3 px-4 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <StudentDetails />
        </Suspense>
      </ErrorBoundary>

      {canReadContacts && (
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={params.id}
            fallback={
              <div className="px-4">
                <Skeleton className="h-20 w-full" />
              </div>
            }
          >
            <StudentContactTable studentId={params.id} />
          </Suspense>
        </ErrorBoundary>
      )}
    </HydrateClient>
  );
}
