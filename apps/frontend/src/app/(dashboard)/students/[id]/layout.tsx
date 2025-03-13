import React, { Suspense } from "react";

import { Skeleton } from "@repo/ui/components/skeleton";
import { NoPermission } from "~/components/no-permission";

import { auth } from "@repo/auth";
import { redirect } from "next/navigation";
import { StudentFooter } from "~/components/students/StudentFooter";
import { StudentHeader } from "~/components/students/StudentHeader";
import { api } from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const { user } = session;

  const { id } = params;
  const student = await api.student.get(id);

  const { children } = props;

  if (user.profile == "student" && user.id !== student.userId) {
    return <NoPermission isFullPage={true} className="mt-8" resourceText="" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <StudentHeader student={student} />

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
