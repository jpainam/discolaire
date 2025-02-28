import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "~/permissions";

import { ClassroomDetails } from "~/components/classrooms/ClassroomDetails";
import { EnrollmentDataTable } from "~/components/classrooms/enrollments/EnrollmentDataTable";
import { EnrollmentHeader } from "~/components/classrooms/enrollments/EnrollmentHeader";
//import TopTimetable from "~/components/classrooms/TopTimetable";
//import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // const timetables = await api.lesson.byClassroom({
  //   classroomId: params.id,
  //   currentDate: new Date(),
  // });

  const { id } = params;

  const canReadEnrollment = await checkPermissions(
    PermissionAction.READ,
    "classroom:enrollment"
  );

  return (
    <>
      <ClassroomDetails classroomId={id} />
      {/* <div>
          <GenderPie classroom={classroom} />
        </div>
        <div>
          <CreditDebitPie />
        </div> */}
      {/* {timetables.length != 0 && <TopTimetable />} */}

      <EnrollmentHeader classroomId={id} />
      {/* <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-2 p-2 ">
        <GenderPie classroom={classroom} />
        <RepeatingPie students={students} />
        <GenderPie classroom={classroom} />
        <GenderPie classroom={classroom} />
      </div> */}
      {canReadEnrollment && (
        <div className="py-2 px-4">
          <EnrollmentDataTable classroomId={id} />
        </div>
      )}
    </>
  );
}
