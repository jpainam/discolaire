import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";

import { ClassroomDetails } from "~/components/classrooms/ClassroomDetails";
import EnrollmentDataTable from "~/components/classrooms/enrollments/EnrollmentDataTable";
import { EnrollmentHeader } from "~/components/classrooms/enrollments/EnrollmentHeader";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  // const classroom = await api.classroom.get(id);
  const canReadEnrollment = await checkPermissions(
    PermissionAction.READ,
    "classroom:enrollment",
  );

  return (
    <div className="flex w-full flex-col">
      <ClassroomDetails classroomId={id} />
      {/* <div>
          <GenderPie classroom={classroom} />
        </div>
        <div>
          <CreditDebitPie />
        </div> */}

      <EnrollmentHeader classroomId={id} />
      {/* <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-2 p-2 ">
        <GenderPie classroom={classroom} />
        <RepeatingPie students={students} />
        <GenderPie classroom={classroom} />
        <GenderPie classroom={classroom} />
      </div> */}
      {canReadEnrollment && <EnrollmentDataTable classroomId={id} />}
    </div>
  );
}
