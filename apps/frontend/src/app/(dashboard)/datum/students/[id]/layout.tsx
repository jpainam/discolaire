import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { StudentFooter } from "@/components/students/StudentFooter";
import { StudentHeader } from "@/components/students/StudentHeader";
import { StudentSidebar } from "@/components/students/StudentSidebar";
import { api } from "@/trpc/server";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { Skeleton } from "@repo/ui/skeleton";

export default async function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // const canReadStudent = await checkPermissions(
  //   PermissionAction.READ,
  //   "student",
  //   {
  //     id: id,
  //   }
  // );
  // if (!canReadStudent) {
  //   return <NoPermission isFullPage={true} className="mt-8" resourceText="" />;
  // }
  const student = await api.student.get(id);
  if (!student) {
    notFound();
  }
  return (
    <div className="grid w-full flex-row md:flex">
      <StudentSidebar />
      <Card className="m-1 flex-1">
        <CardHeader className="bg-muted/50 p-1">
          <StudentHeader />
        </CardHeader>
        <Separator />
        {/* <CardContent className="flex h-[calc(100vh-20rem)] flex-1 w-full p-0"> */}
        <CardContent className="min-h-[60vh] p-0">{children}</CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-1">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <StudentFooter />
          </Suspense>
        </CardFooter>
      </Card>
      {/* <StudentRightbar /> */}
    </div>
  );
}
