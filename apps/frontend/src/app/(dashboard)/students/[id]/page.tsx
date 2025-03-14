import { notFound } from "next/navigation";

import { Separator } from "@repo/ui/components/separator";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { checkPermission } from "@repo/api/permission";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import StudentDetails from "~/components/students/profile/StudentDetails";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const school = await api.school.getSchool();
  const student = await api.student.get(params.id);
  if (student.schoolId !== school.id) {
    notFound();
  }
  const canReadStudent = await checkPermission(
    "student",
    PermissionAction.READ,
  );
  if (!canReadStudent) {
    return <NoPermission className="my-8" />;
  }
  const canReadContacts = await checkPermission(
    "student",
    PermissionAction.READ,
  );
  return (
    <div className="grid py-2 text-sm">
      <StudentDetails />
      <Separator className="my-2 w-full" />
      {canReadContacts && <StudentContactTable studentId={params.id} />}
    </div>
  );
}
