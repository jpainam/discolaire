import React, { Suspense } from "react";

import { checkPermissions } from "@repo/api/permission";
import { Skeleton } from "@repo/ui/components/skeleton";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { StudentFooter } from "~/components/students/StudentFooter";
import { StudentHeader } from "~/components/students/StudentHeader";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;

  const canReadStudent = await checkPermissions(
    PermissionAction.READ,
    "student:profile",
    {
      id: id,
    },
  );
  if (!canReadStudent) {
    return <NoPermission isFullPage={true} className="mt-8" resourceText="" />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <StudentHeader />

      {/* <CardContent className="flex h-[calc(100vh-20rem)] flex-1 w-full p-0"> */}
      <main className="flex-1">{children}</main>
      <div className="flex flex-row items-center border-y bg-muted/50 px-6 py-1">
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <StudentFooter />
        </Suspense>
      </div>
    </div>
  );
}
