import { notFound } from "next/navigation";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";
import { Separator } from "@repo/ui/separator";

import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import StudentDetails from "~/components/students/profile/StudentDetails";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  const school = await api.school.getSchool();
  const student = await api.student.get(params.id);
  if (!school || student.schoolId !== school.id) {
    notFound();
  }
  const canReadStudent = await checkPermissions(
    PermissionAction.READ,
    "student:profile",
    {
      id: student.id,
    },
  );
  if (!canReadStudent) {
    return <NoPermission className="my-8" />;
  }
  const canReadContacts = await checkPermissions(
    PermissionAction.READ,
    "student:contact",
    {
      id: params.id,
    },
  );
  return (
    <div className="grid py-2 text-sm">
      <StudentDetails />
      <Separator className="my-2 w-full" />
      {canReadContacts && <StudentContactTable studentId={params.id} />}
    </div>
  );
}
