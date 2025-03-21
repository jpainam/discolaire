import { Separator } from "@repo/ui/components/separator";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { checkPermission } from "@repo/api/permission";
import { auth } from "@repo/auth";
import type { Metadata } from "next";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import StudentDetails from "~/components/students/profile/StudentDetails";
import { api } from "~/trpc/server";

interface Props {
  params: Promise<{ id: string }>;
  //searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: Props
  //parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const student = await api.student.get(id);

  // optionally access and extend (rather than replace) parent metadata
  //const previousImages = (await parent).openGraph?.images || [];

  return {
    title: {
      template: `${student.lastName}-%s`,
      default: "Student",
    },
    // openGraph: {
    //   images: ["/some-specific-page-image.jpg", ...previousImages],
    // },
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const student = await api.student.get(params.id);

  const session = await auth();
  let canReadContacts =
    session?.user.profile === "student" && session.user.id === student.userId;

  if (session?.user.profile === "staff") {
    const canReadStudent = await checkPermission(
      "student",
      PermissionAction.READ
    );
    if (!canReadStudent) {
      return <NoPermission className="my-8" />;
    }
    canReadContacts = await checkPermission("student", PermissionAction.READ);
  }

  return (
    <div className="grid py-2 text-sm">
      <StudentDetails />
      <Separator className="my-2 w-full" />
      {canReadContacts && <StudentContactTable studentId={params.id} />}
    </div>
  );
}
