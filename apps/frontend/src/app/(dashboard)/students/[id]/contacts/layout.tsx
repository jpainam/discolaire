import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";

import { SignUpContact } from "~/components/students/contacts/SignUpContact";
import { StudentContactHeader } from "~/components/students/contacts/StudentContactHeader";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import { prefetch, trpc } from "~/trpc/server";

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
    <div className="grid w-full flex-col md:flex">
      <StudentContactHeader />
      <Separator />
      <SignUpContact />
      <Suspense fallback={<StudentContactSkeleton />}>
        <StudentContactTable
          //studentContacts={studentContacts}
          studentId={params.id}
        />
      </Suspense>
      {children}
    </div>
  );
}

function StudentContactSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-4 w-full p-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton key={index} className="h-8" />
      ))}
    </div>
  );
}
