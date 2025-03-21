import { Separator } from "@repo/ui/components/separator";
import type { Metadata } from "next";

import { SignUpContact } from "~/components/students/contacts/SignUpContact";
import { StudentContactHeader } from "~/components/students/contacts/StudentContactHeader";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";

export const metadata: Metadata = {
  title: "Contacts",
};

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  return (
    <div className="grid w-full flex-col md:flex">
      <StudentContactHeader />
      <Separator />
      <SignUpContact />
      <StudentContactTable studentId={params.id} />
      {children}
    </div>
  );
}
