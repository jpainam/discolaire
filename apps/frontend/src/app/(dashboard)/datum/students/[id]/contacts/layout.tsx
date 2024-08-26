import { Separator } from "@repo/ui/separator";

import { SignUpContact } from "~/components/students/contacts/SignUpContact";
import { StudentContactHeader } from "~/components/students/contacts/StudentContactHeader";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";

//import { checkPermissions } from "~/server/permission";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // const canReadStudentContact = await checkPermissions(
  //   PermissionAction.READ,
  //   "student:contact",
  //   {
  //     id: params.id,
  //   },
  // );
  // if (!canReadStudentContact) {
  //   return <NoPermission isFullPage={true} resourceText="" />;
  // }

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
