import { Separator } from "@repo/ui/components/separator";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { checkPermission } from "@repo/api/permission";
import { auth } from "@repo/auth";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import StudentDetails from "~/components/students/profile/StudentDetails";
import { api, caller } from "~/trpc/server";

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

  const studentContacts = await caller.student.contacts(params.id);

  return (
    <div className="grid py-2 text-sm">
      <StudentDetails />
      <Separator className="my-2 w-full" />
      {canReadContacts && (
        <StudentContactTable
          studentContacts={studentContacts}
          studentId={params.id}
        />
      )}
    </div>
  );
}
