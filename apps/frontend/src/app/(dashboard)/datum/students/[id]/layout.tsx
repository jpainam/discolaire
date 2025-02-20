import React, { Suspense } from "react";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { NoPermission } from "@repo/ui/components/no-permission";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

import { StudentFooter } from "~/components/students/StudentFooter";
import { StudentHeader } from "~/components/students/StudentHeader";
import { StudentSidebar } from "~/components/students/StudentSidebar";

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
    <div className="flex flex-1 flex-row">
      <StudentSidebar className="hidden border-r md:block" />
      <Card className="flex-1 border-none shadow-none md:ml-[220px]">
        <CardHeader className="bg-muted/50 p-1">
          <StudentHeader />
        </CardHeader>
        <Separator />
        {/* <CardContent className="flex h-[calc(100vh-20rem)] flex-1 w-full p-0"> */}
        <CardContent className="min-h-[60vh] p-0">{children}</CardContent>
        <CardFooter className="flex flex-row items-center border-y bg-muted/50 px-6 py-1">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <StudentFooter />
          </Suspense>
        </CardFooter>
      </Card>
    </div>
  );
}
